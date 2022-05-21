from pathlib import Path
from itertools import chain
from logzero import logger
from copy import deepcopy
from typing import List
from dataclasses import dataclass

import torch
from transformers import BertForTokenRegression, BertConfig
from libedax4py import (
    libedax,
    edaxutil,
    HintList,
    Edax,
)


from othello_lib.othello_utils import Board, Position, ScoreBoard, Disk, BitBoard, Color, Score
from othello_lib.othello_logic import OthelloLogic
from .base_ai import BaseAI



class OthelloToken:
    PUT = 6
    LEAGAL = 5
    BLANK = 4
    OPPONENT = 3
    ME = 2
    MASK = 1
    PAD = 0


class OthelloEvalScoreRegrssionTokenizer:
    def __init__(self):
        self.BLANK_SCORE = -100

    @torch.no_grad()
    def __call__(self, board:Board, legal_move_board:BitBoard, color:bool):
        HEIGH, WIDTH = board.size()
        
        if color == Color.BLACK:
            my_board_iterator = chain.from_iterable(board.black)
            opponent_board_iterator = chain.from_iterable(board.white)
        else:
            my_board_iterator = chain.from_iterable(board.white)
            opponent_board_iterator = chain.from_iterable(board.black)
        
        legal_move_bit_tensor = torch.tensor(
            legal_move_board,
            dtype=torch.bool,
        ).view(-1)

        board_tensor = torch.tensor(
            [
                self.get_token(me, op)
                for me, op in zip(
                        my_board_iterator,
                        opponent_board_iterator
                )
            ],
            dtype=torch.long,
        )
        
        input_ids = torch.where(
            legal_move_bit_tensor,
            torch.full_like(
                legal_move_bit_tensor,
                OthelloToken.LEAGAL,
                dtype=torch.long
            ),
            board_tensor
        )
        
        return {
            "input_ids": input_ids,
        }

    def get_token(self, my_flag:bool, opponent_flag:bool):
        assert not(my_flag and opponent_flag), "Both black and white are true..."
        if not my_flag and not opponent_flag:
            return OthelloToken.BLANK
        elif my_flag:
            return OthelloToken.ME
        elif opponent_flag:
            return OthelloToken.OPPONENT
        else:
            raise RuntimeError()




@dataclass
class TreeNode:
    root_moove: Position
    board: Board
    best_score: Score
    


class BertAI(BaseAI):
    name = "BERT"
    def __init__(
            self,
            args,
    ):
        super().__init__()
        self.edax = Edax(
            level=1,
        )
        #mode_name_or_path = Path(__file__).parent / f"weight_data/bert_weights/OthelloBertTokenRegression"
        model_name_or_path = Path(__file__).parent.parent.parent / "models/test_model"
        logger.info(f"Load pretrained model from {model_name_or_path}")
        self.bert = BertForTokenRegression.from_pretrained(model_name_or_path)
        logger.info(f"Loading done!")
        self.tokenizer = OthelloEvalScoreRegrssionTokenizer()
        self.gpu_id = -1 if args.gpu_id is None else args.gpu_id
        self.use_beam_search = args.use_beam_search
        if self.use_beam_search:
            self.beam_max_width = 5
            self.beam_serach_max_depth = 5
            
        if self.gpu_id != -1:
            self.bert.to(f"cuda:{self.gpu_id}")

        
    
    def set_edax_board(self, board:Board, color:bool):
        color_mark = "*" if color == Disk.BLACK else "w"
        board_string = board.to_string_board() + color_mark
        self.edax.edax_setboard(board_string.encode())
        self.edax.edax_new()

        
    def calc_score(self, board:Board, color:bool):
        if self.use_beam_search:
            return self.beam_search(board, color)
       
        
        height, width = board.size()
        assert height == width == 8, "Board size must be 8x8..."
        self.set_edax_board(board, color)
        hintlist = HintList()
        self.edax.edax_hint(100, hintlist)

        score_board = ScoreBoard(height, width)
        legal_move_board = BitBoard(height, width)
        
        for h in hintlist.hint[1 : hintlist.n_hints + 1]:
            pos = Position(move=h.move)
            legal_move_board[pos.y][pos.x] = True
        
        batch = self.tokenizer(board, legal_move_board, color)
        if self.gpu_id != -1:
            batch = {k: torch.unsqueeze(v, 0).to(f"cuda:{self.gpu_id}") for k, v in batch.items()}
        else:
            batch = {k: torch.unsqueeze(v, 0) for k, v in batch.items()}
        
        output = self.bert(**batch)
        list_logits = output.logits.view(height, width).tolist()

        for y in range(height):
            for x in range(width):
                if legal_move_board[y][x]:
                    score_board[y][x] = list_logits[y][x]
        
        return score_board


    def make_possibilities(self, board:Board, color:bool):
        next_boards = []
        move_list = []
        self.set_edax_board(board, color)
        
        if self.edax.edax_can_move():
            hintlist = HintList()
            self.edax.edax_hint(100, hintlist)

            for h in hintlist.hint[1 : hintlist.n_hints + 1]:
                pos = Position(move=h.move)
                self.set_edax_board(board, color)
                self.edax.edax_move(pos.move)
                next_boards.append(
                    Board.from_edax(self.edax)
                )
                move_list.append(pos)

        return next_boards, move_list


    def calc_all_bords_score(self, bord_list:List[Board], color:bool):
        legal_move_board_list = []
        scores = [None for _ in range(len(bord_list))]
        height, width = bord_list[0].size()
        
        for i, board in enumerate(bord_list):
            legal_move_board = BitBoard(height, width)
            self.set_edax_board(board, color)
            
            if self.edax.edax_is_game_over():
                black_count, white_cpunt = board.count()
                if color == Color.BLACK:
                    scores[i] = Score(
                        score=black_count - white_cpunt,
                        pos=None,
                    )
                    
                else:
                    scores[i] = Score(
                        score=white_cpunt - black_count,
                        pos=None,
                    )
                    
            elif not self.edax.edax_can_move():
                scores[i] = Score(
                    score=64,
                    pos=None,
                )
            else:
                hintlist = HintList()
                self.edax.edax_hint(100, hintlist)

                for h in hintlist.hint[1 : hintlist.n_hints + 1]:
                    pos = Position(move=h.move)
                    legal_move_board[pos.y][pos.x] = True

            legal_move_board_list.append(legal_move_board)

        batch_source = []
        for board, legal_move_board in zip(bord_list, legal_move_board_list):
            batch_source.append(
                self.tokenizer(board, legal_move_board, color)
            )
        
        batch = {k:[] for k in batch_source[0].keys()}
        for instance in batch_source:
            for k, v in instance.items():
                batch[k].append(v)

        batch = {k: torch.stack(v) for k, v in batch.items()}
        if self.gpu_id != -1:
            batch = {k: v.to(f"cuda:{self.gpu_id}") for k, v in batch.items()}

        output = self.bert(**batch)
        
        list_logits = output.logits.view(-1, height, width).tolist()
        assert len(list_logits) == len(scores), "List length don't match..."
        for i, logits_board in enumerate(list_logits):
            if scores[i] is not None:
                continue
            score_board = ScoreBoard(height, width)
            for y in range(height):
                for x in range(width):
                    if legal_move_board[y][x]:
                        score_board[y][x] = logits_board[y][x]

            scores[i] = self.select_best(score_board)

        return scores

            

    def expand_nodes(self, nodes:List[TreeNode], color:bool):
        next_boards = []
        expanded_nodes = []
        
        for node in nodes:
            boards, _ = self.make_possibilities(node.board, color)
            next_boards += boards
            expanded_nodes += [
                TreeNode(root_moove=node.root_moove, board=board, best_score=None)
                for board in boards
            ]

        if len(expanded_nodes) == 0:
            return expanded_nodes
            
        scores = self.calc_all_bords_score(next_boards, not color)
        assert len(scores) == len(expanded_nodes), "List length don't match..."
        for node, score in zip(expanded_nodes, scores):
            node.best_score = score
        
        return expanded_nodes
    

    
    def beam_search(self, board:Board, color:bool):
        temp_color = color
        next_boards, move_list = self.make_possibilities(board, temp_color)
        scores = self.calc_all_bords_score(next_boards, not temp_color)
        nodes = [
            TreeNode(root_moove=move, board=board, best_score=score)
            for board, move, score in zip(next_boards, move_list, scores)
        ]
        nodes = sorted(nodes, key=lambda n: n.best_score.score)[:self.beam_max_width]
        temp_color = not temp_color

        
        for depth in range(self.beam_serach_max_depth - 2):
            expanded_nodes = self.expand_nodes(nodes, temp_color)
            if len(expanded_nodes) == 0:
                break
            
            nodes = expanded_nodes
            temp_color = not temp_color
            if all(nodes[0].root_moove == node.root_moove for node in nodes) or \
               depth == self.beam_serach_max_depth - 3:
                nodes = sorted(nodes, key=lambda n: n.best_score.score)
                break
            nodes = sorted(nodes, key=lambda n: n.best_score.score)[:self.beam_max_width]    
            
            
        score_board = ScoreBoard(*board.size())
        if temp_color != color:
            for node in reversed(nodes):
                score_board[node.root_moove.y][node.root_moove.x] = -node.best_score.score
        else:
            for node in reversed(nodes):
                score_board[node.root_moove.y][node.root_moove.x] = node.best_score.score

        return score_board
            
        
        
    

    def __dell__(self):
        self.edax.terminate()


    @staticmethod
    def add_args(parser):
        parser.add_argument("--gpu_id", help="Selegct gpu id", type=int, default=-1)
        parser.add_argument("--use_beam_search", help="Specify whether to use beam search", action="store_true")
        return parser
        
