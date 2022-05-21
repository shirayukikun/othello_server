from othello_lib.othello_utils import Board, Position, ScoreBoard, Disk
import random


class BaseAI:
    name = None
    
    def __init__(self, seed=42):
        self.rand = random.Random(seed)
        

    def calc_score(self, board:Board, color:bool):
        raise NotImplementedError()


    def move(self, board:Board, color, selection_policy="best"):
        score_board = self.calc_score(board, color)
        
        # top-{randomness}の中から選択
        if selection_policy == "best":
            return self.select_best(score_board).pos
        elif selection_policy == "slop":
            return self.select_depend_on_slop(score_board).pos
        else:
            raise NotImplementedError()



    def select_best(self, score_board):
        return max(
            filter(lambda s: s.score is not None, score_board.to_score_list()),
            key=lambda s: s.score,
        )


    def select_depend_on_slop(self, score_board):
        legal_score_list = [s for s in score_board.to_score_list() if s.score is not None]
        assert len(legal_score_list) > 0, "There is no candidate legal moves..."
        return self.rand.choices(
            legal_score_list,
            weights=[s.score for s in legal_score_list],
            k=1,
        )[0]

    
    @staticmethod
    def add_args(parser):
        return parser
