from libedax4py import libedax, edaxutil, HintList
from libedax4py import Board as EdaxBoard
from libedax4py import Position as EdaxPosition


from othello_lib.othello_utils import Board, Position, ScoreBoard, Disk
from .edax_ai import EdaxAI


class RandomAI(EdaxAI):
    name = "random"
    
    def __init__(self, args):
        super().__init__(args, level=0)
        
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
            score_board[pos.y][pos.x] = self.rand.random()
            
        return score_board
