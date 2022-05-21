from libedax4py import (
    libedax,
    edaxutil,
    HintList,
    Edax,
    DEFAULT_BOOK_DATA_PATH,
    DEFAULT_EVAL_DATA_PATH
)

from libedax4py import Board as EdaxBoard
from libedax4py import Position as EdaxPosition

from othello_lib.othello_utils import Board, Position, ScoreBoard, Disk
from othello_lib.othello_logic import OthelloLogic
from .base_ai import BaseAI


class EdaxAI(BaseAI):
    name = "edax"
    
    def __init__(
            self,
            args,
            book_file_path=DEFAULT_BOOK_DATA_PATH,
            eval_file_path=DEFAULT_EVAL_DATA_PATH,
            level=17,
    ):
        super().__init__()
        self.edax = Edax(
            book_file_path=book_file_path,
            eval_file_path=eval_file_path,
            level=level,
        )
        

    def set_edax_board(self, board:Board, color:bool):
        color_mark = "*" if color == Disk.BLACK else "w"
        board_string = board.to_string_board() + color_mark
        self.edax.edax_setboard(board_string.encode())
        self.edax.edax_new()

        
    def calc_score(self, board:Board, color:bool):
        height, width = board.size()
        assert height == width == 8, "Board size must be 8x8..."
        #self.intialize_edax(board, color)
        self.set_edax_board(board, color)
        hintlist = HintList()
        self.edax.edax_hint(100, hintlist)

        score_board = ScoreBoard(height, width)
        for h in hintlist.hint[1 : hintlist.n_hints + 1]:
            pos = Position(move=h.move)
            score_board[pos.y][pos.x] = h.score
            
        return score_board


    def __dell__(self):
        self.edax.terminate()
        
