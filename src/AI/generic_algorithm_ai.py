from pathlib import Path
from itertools import chain
import copy
from collections import Counter

from othello_lib.othello_utils import Board, Position, ScoreBoard, Disk
from .base_ai import BaseAI

class osero_data_wrapper:
    def __init__(self, i, j, reverse_piece, open_degree, even_theory):
        self.i = i
        self.j = j
        self.reverse_piece = reverse_piece
        self.open_degree = open_degree
        self.even_theory = even_theory



class GenericAlgorithmAI(BaseAI):
    name = "generic"

    def __init__(self, args, seed=42):
        super().__init__(seed=seed)

        self.color = 0
        self.decision = 0

        self.direction = [[0,1],[-1,0],[0,-1],[1,0],[-1,1],[-1,-1],[1,-1],[1,1]]
        self.height = 8
        self.width = 8
        self.cost_matrix = self.make_locate_cost()
        self.depth = 3
        self.turn_count = 0
        self.number_of_piece = [None, 0, 0]
        self.max_turn = self.height * self.width - 4
        self.corner_cost = 0
        self.count_start = 8

        #load weight
        weight_file_path = Path(__file__).parent / f"weight_data/generic_algorithm_ai/weight_data_{self.height}{self.width}.txt"

        with weight_file_path.open(mode="r") as f:
            w = [float(line.strip()) for line in f]
        assert len(w) == 12, "number of weight error"
        
        self.k = w[0]
        self.ET_ths = w[1]
        self.corner_rate = w[2]
        self.x_rate = w[3]
        self.locate_v = w[4]
        self.definite_v = w[5]
        self.open_degree_v = w[6]
        self.pal_locate_sum_v = w[7]
        self.wing_v = w[8]
        self.mountain_v = w[9]
        self.even_theory_v = w[10]
        self.pass_v = w[11]


    def convert2legacy_board(self, board:Board):
        legacy_board = [[0 for i in range(self.height)] for j in range(self.width)]

        for x in range(self.width):
            for y in range(self.height):
                # void: 0, black: 1, white: 2
                if board.black[y][x]:
                    legacy_board[x][y] = 1
                elif board.white[y][x]:
                    legacy_board[x][y] = 2

        return legacy_board


    def convert2legacy_color(self, color:bool):
        return 1 if color == Disk.BLACK else 2
              
    def calc_score(self, board:Board, color:bool):
        self.update(board, color)
        legacy_board = self.convert2legacy_board(board)
        
        if self.turn_count >= (self.height * self.width - (4 + self.count_start)):
            return self.counting(
                legacy_board,
                self.color,
                start=True
            )        
        else:
            board = self.DPS(
                legacy_board,
                self.color,
                self.depth,
                self.cal_evalue
            )
            return board
        

    def update(self, board:Board, color:bool):
        self.number_of_piece[1], self.number_of_piece[2] = board.count()
        self.turn_count = sum(chain(*board.black)) + sum(chain(*board.white)) - 3
        self.update_cost_matrix()
        self.color = self.convert2legacy_color(color)
        return self
    
    
    def DPS(self, board, color, depth, e_func):
        
        if depth == 0:
            return 0
        
        option, option_data = self.make_all_possibility(board, color)
        e_value_list = []
        
        
        for sample, sample_data in zip(option,option_data):
            board_eva = e_func(sample, color, sample_data)
            e_value_list.append(
                board_eva - self.k * self.DPS(sample, -1*(color-3), depth - 1, e_func)
            )
            
        
        if depth == self.depth:
            score_board = ScoreBoard(self.height, self.width)            
            for info, score in zip(option_data, e_value_list):
                score_board[info.j][info.i] = score
            
            return score_board
        

        
        if len(e_value_list) == 0:
            return self.cal_pass_point()

        return max(e_value_list)
 
    
    def cal_evalue(self, board, color, data_wrapper):
        i = data_wrapper.i
        j = data_wrapper.j
        wing, mountain = self.check_side_form(board,color)
        corner_cost, pal_locate_sum = self.cal_value_from_pal(board,color)
        
        result = 0
        result += self.locate_v * self.cost_matrix[i][j]
        result += self.definite_v * self.count_definite_stone(board,color)
        result += -1 * self.open_degree_v  * data_wrapper.open_degree
        result += 1 * corner_cost
        result += -1 * self.pal_locate_sum_v * pal_locate_sum
        result += -1 * self.wing_v * wing
        result += self.mountain_v * mountain
        result += self.even_theory_v * data_wrapper.even_theory
        
        return result

    def make_all_possibility(self,board,color):
        puttable_locate = self.make_put_locate_matrix(board, color)
        open_degree_matrix = self.open_degree(board, color)
        result_1 = []
        result_2 = []
        
        for i in range(self.height):
            for j in range(self.width):
                if puttable_locate[i][j] > 0:
                    even_theory = self.even_theory_value(board, i, j)
                    result_1.append(self.make_reversed_matrix(board, color, i, j))
                    temp_data = osero_data_wrapper(i, j, puttable_locate[i][j]
                                                   ,open_degree_matrix[i][j]
                                                   ,even_theory)
                    result_2.append(temp_data)

        return result_1, result_2
    

    def cal_pass_point(self):        
        return self.pass_v
    

    def counting(self, board, color, pass_frag=False, start = False):
        option, option_ij, finish = self.make_all_possibility_basic(board,color)

        if finish:
            return self.check_board(board)
        
        next_color = -1 * (color - 3)
        if len(option) == 0:
            if pass_frag:
                return self.check_board(board)
            else:
                return self.counting(board,next_color, pass_frag = True)
        
        result = [0, 0, 0, 0]
        max_rate = -1.0
        max_ij = (None, None)
        max_data = None

        
        
        
        for sample, sample_ij in zip(option, option_ij):
            temp = self.counting(sample, next_color)
            
            if color == self.color:
                temp_rate = temp[color] / temp[0]
                
        
                if temp_rate > max_rate:
                    max_rate = temp_rate
                    max_ij = sample_ij
                    max_data = temp
                    
                    if max_rate >= 1.0:
                        break

                    
            else:
                result = [i + j for i,j in zip(result, temp)]

        
        if start:
            score_board = ScoreBoard(self.height, self.width)
            score_board[max_ij[1]][max_ij[0]] = max_rate
            return score_board

        if color == self.color:
            return max_data
        else:
            return result
        
        return

        
    def check_board(self,board):
        result = [1, 0, 0, 0]
        
        board_counter = Counter(chain(*board))
        black = board_counter[1]
        white = board_counter[2]
        
        result[1] += (black > white)
        result[2] += (white > black)
        result[3] += (black == white)
        return result

    def update_cost_matrix(self):
        hw = self.height * self.width
        t = self.turn_count
        x_cost =  (-1 * (t - hw - 5) * (t - hw - 5) / (hw * 10)) + 1
        coner_cost = -1*x_cost 
        self.corner_cost = coner_cost * self.corner_rate
        
        self.cost_matrix[1][1]=self.x_rate * x_cost
        self.cost_matrix[1][self.width - 2] = self.x_rate * x_cost
        self.cost_matrix[self.height - 2][1] = self.x_rate * x_cost
        self.cost_matrix[self.height - 2][self.width - 2] = self.x_rate * x_cost
        
        self.cost_matrix[0][0] = self.corner_rate * coner_cost
        self.cost_matrix[0][-1] = self.corner_rate * coner_cost
        self.cost_matrix[-1][0] = self.corner_rate * coner_cost
        self.cost_matrix[-1][-1] = self.corner_rate * coner_cost
        
        self.pal_locate_sum_v = (1 / (hw * 20)) * (t - hw - 20) * (t - hw - 20) - 2 
        return
    
    def make_reversed_matrix(self,input_board,color,i,j):
        board = copy.deepcopy(input_board)
        temp_x = i
        temp_y = j
        x = temp_x
        y = temp_y
        
        reverse = 0

        if board[x][y] != 0:
            return board

        for vec in self.direction:
            reverse = 0
            x = temp_x
            y = temp_y
            while True:
                x = x + vec[0]
                y = y + vec[1]

                if (x < 0 or x > self.width-1 or y < 0 or y > self.height-1):
                    reverse=0
                    break

                if(board[x][y] == 0):
                    reverse = 0
                    break

                if(board[x][y] == color):
                    break

                if(board[x][y] == -1 * (color - 3)):
                    reverse += 1
                    
            x = temp_x
            y = temp_y
            if reverse > 0:
                for i in range(reverse):
                    x += vec[0]
                    y += vec[1]
                    board[x][y] = -1 * (board[x][y] - 3)
                board[temp_x][temp_y] = color

        return board

    def make_put_locate_matrix(self,board,color):
        height = self.height
        width = self.width
        result_matrix = [[0 for i in range(width)] for j in range(height)]
        
        for i in range(height):
            for j in range(width):
                can_put=False
                if board[i][j] != 0:
                    result_matrix[i][j] = 0
                    continue
                
                reverse_sum = 0
                for vec in self.direction:
                    x = i
                    y = j
                    reverse=0
                    while True:
                        x += vec[0]
                        y += vec[1]

                        if x < 0 or x > width-1 or y < 0 or y > height - 1:
                            reverse = 0
                            break

                        if board[x][y] == 0:
                            reverse = 0
                            break

                        if board[x][y] == color:
                            break
                        
                        if (board[x][y] == -1*(color - 3)):
                            reverse += 1

                    if reverse > 0:
                        reverse_sum += reverse
                        can_put = True
                        
                
                result_matrix[i][j] = reverse_sum if can_put else 0

        return result_matrix



    def make_open_degree(self,board):
        height = self.height
        width = self.width
        
        result = [[0 for i in range(width)] for j in range(height)]
        
        for i in range(height):
            for j in range(width):
                if(board[i][j] > 0):
                    open_degre_sum = 0
                    for vec in self.direction:
                        if i+vec[0] >= height or i+vec[0] < 0 or j+vec[1] >= width or j+vec[1] < 0:
                            continue
                        
                        if board[i+vec[0]][j+vec[1]] == 0:
                            open_degre_sum += 1
                    result[i][j] = open_degre_sum
  
                            
        return result
    

    def open_degree(self, board, color):
        height = self.height
        width = self.width
        od_matrix = self.make_open_degree(board)
        
        result_matrix =  [[0 for i in range(width)] for j in range(height)]
        
        for i in range(height):
            for j in range(width):

                can_put=False
                if board[i][j] != 0:
                    result_matrix[i][j] = 0
                    continue

                reverse_sum = 0
                for vec in self.direction:
                    x = i
                    y = j
                    reverse=0
                    while(1):
                        x = x + vec[0]
                        y= y + vec[1]

                        if (x < 0 or x > width - 1 or y < 0 or y > height - 1):
                            reverse = 0
                            break

                        if(board[x][y]==0):
                            reverse = 0
                            break

                        if(board[x][y]==color):
                            break
                        
                        if board[x][y] == -1 * (color - 3):
                            reverse += od_matrix[x][y]

                    if reverse>0:
                        reverse_sum += reverse
                        can_put = True
                        
                
                result_matrix[i][j]=reverse_sum if can_put else 0

        return result_matrix
        

    def make_locate_cost(self):
        height = self.height
        width = self.width
        
        if height==8 and width== 8:
            result = [[45, 3,15,14,14,15, 3,45],
                      [ 3, 0,12,12,12,12, 0, 3],
                      [15,12,15,14,14,15,12,15],
                      [14,12,14,14,14,14,12,14],
                      [14,12,14,14,14,14,12,14],
                      [15,12,15,14,14,15,12,15],
                      [ 3, 0,12,12,12,12, 0, 3],
                      [45, 3,15,14,14,15, 3,45]]
            
            return result

        if height==6 and width==6:
            result = [[100, 3,15,15, 3,100],
                      [ 3, 0,14,14, 0, 3],
                      [15,14,14,14,14,15],
                      [15,14,14,14,14,15],
                      [ 3, 0,14,14, 0, 3],
                      [100, 3,15,15, 3,100]]
            
            return result

        result = [[0 for i in range(height)] for j in range(width)]
        
        result[0][0]=45
        result[0][-1]=45
        result[-1][0]=45
        result[-1][-1]=45
        
        result[0][1]=3
        result[0][-2]=3
        result[1][0]=3
        result[1][-1]=3
        
        result[-1][1]=3
        result[-1][-2]=3
        result[-2][0]=3
        result[-2][-1]=3

        result[1][1]=0
        result[1][-2]=0
        result[-2][1]=0
        result[-2][-2]=0
        
        return result
    

    
    def count_definite_stone(self, board, color):
        height = self.height
        width = self.width
        definite_locate = [[0 for i in range(width)] for j in range(height)]
        direc = [(0,0),(-1,0),(-1,-1),(0,-1)]

        for i, j in direc:
            
            if(board[i][j] == color):
                definite_locate[i][j] = 1
            
                for k in range(height):
                    k = - 1 * (k + 1) if i == -1 else k
                
                    if board[k][j] == color:
                        definite_locate[k][j] = 1
                    else:
                        break

                
                for k in range(width):
                    k = - 1 * (k + 1) if j == -1 else k
                    if board[i][k] == color:
                        definite_locate[i][k] = 1
                    else:
                        break
        
        return sum(chain(*definite_locate))


    def check_side_form(self, board, color):
        height = self.height
        width = self.width
        definite_locate = [[0 for i in range(width)] for j in range(height)]
        mountain = 0
        wing = 0
        direc = [(0,0), (-1,0), (-1,-1), (0,-1)]
        
        for i, j in direc:
            
            if board[i][j] == 0:
                
                count = 0
                for k in range(1, height - 1):
                    k = -1 * (k+1) if i == -1 else k
                
                    if(board[k][j]==color):
                        count += 1
                    else:
                        break
                
                if count == height - 3:
                    wing += 1

                if count == height - 2:
                    mountain += 1

                count = 0
                for k in range(1,width-1):
                    k = - 1 * (k + 1) if j == -1 else k
                    if board[i][k] == color:
                        count += 1
                    else:
                        break

                if count == width - 3:
                    wing += 1

                if count == width - 2:
                    mountain += 1

        mountain = mountain // 2

        return wing, mountain


    def check_even_theory(self, board, i, j):
        if i < 0 or j < 0 or i > self.height -1 or j > self.width-1:
            return 0        

        if board[i][j] == 0:
            board[i][j] = -1
            even_theory_sum = 1 + self.check_even_theory(board, i + 1, j)
            even_theory_sum += self.check_even_theory(board, i + 1, j)
            even_theory_sum += self.check_even_theory(board, i - 1, j)
            even_theory_sum += self.check_even_theory(board, i ,j + 1)
            even_theory_sum += self.check_even_theory(board, i, j-1)
            return even_theory_sum

        return 0


    def even_theory_value(self, board, i, j):
        if self.turn_count >= self.max_turn - self.ET_ths:
            EoO = self.check_even_theory(copy.deepcopy(board), i, j) % 2
            return 2 * EoO - 1
        else:
            return 0

    
    def cal_value_from_pal(self, board, color):
        pal = self.make_put_locate_matrix(board, - 1* (color - 3))
        corner_point = 0
        if pal[0][0] > 0 or pal[0][self.width-1] > 0 or pal[self.height-1][0] > 0 or pal[self.height-1][self.width-1] > 0:
            corner_point += self.corner_cost

        locate_sum = sum(map(lambda x : x > 0, chain(*pal)))                    
        return corner_point, locate_sum



    def make_all_possibility_basic(self,board,color):
        puttable_locate = self.make_put_locate_matrix(board, color)
        finish = True
        result_1 = []
        locate_ij = []
        
        for i in range(self.height):
            for j in range(self.width):
                if puttable_locate[i][j] > 0:
                    result_1.append(self.make_reversed_matrix(board, color, i, j))
                    locate_ij.append((i, j))
                if board[i][j]==0:
                    finish = False

        return result_1, locate_ij, finish
    
