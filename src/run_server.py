import argparse
import os
from pathlib import Path
from typing import List, Dict, Union, Optional

from flask import Flask, render_template, request, jsonify

from othello_lib.othello_logic import OthelloLogic
from othello_lib.othello_utils import Position, Board, Disk
from AI import AIContainer

app = Flask(__name__, static_folder="./templates/static")
app.config["JSON_AS_ASCII"] = False

othello = OthelloLogic()
ai_container = AIContainer()

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/put", methods=["GET", "POST"])
def put():
    json_dict = request.get_json()
    color = json_dict["color"]
    black_board = json_dict["black"]
    white_board = json_dict["white"]
    pos = json_dict["pos"]

    board = Board(black_board, white_board)
    position = Position(x=pos[0], y=pos[1])
    new_board = othello.put(board, position, color)

    if new_board is None:
        returned_data = {
            "put": False
        }
    else:
        pass_flag, end_flag = othello.check_pass(new_board, not color)
        returned_data = {
            "put": True,
            "black": new_board.black,
            "white": new_board.white,
            "pass": pass_flag,
            "end": end_flag,
        }

    return jsonify(returned_data)
        

@app.route("/move", methods=["GET", "POST"])
def move():
    json_dict = request.get_json()
    color = json_dict["color"]
    black_board = json_dict["black"]
    white_board = json_dict["white"]
    selection_policy = json_dict["selection_policy"]
    ai_name = json_dict["ai_name"]
    ai = ai_container.get(ai_name, args)
    
    board = Board(black_board, white_board)
    selected_pos = ai.move(board, color, selection_policy)
    new_board = othello.put(board, selected_pos, color)
    assert new_board is not None, f"\"selected_pos\":{selected_pos} is illegal move"
    
    pass_flag, end_flag = othello.check_pass(new_board, not color)
    returned_data = {
        "black": new_board.black,
        "white": new_board.white,
        "pass": pass_flag,
        "end": end_flag,
    }
    return jsonify(returned_data)
    

@app.route("/load_ai", methods=["GET", "POST"])
def load_ai():
    json_dict = request.get_json()
    ai_name = json_dict["ai_name"]
    status = ai_container.load(ai_name, args)
    
    returned_data = {
        "status": status
    }
    return jsonify(returned_data)




@app.route("/check_pass", methods=["GET", "POST"])
def check_pass():
    json_dict = request.get_json()
    color = json_dict["color"]
    black_board = json_dict["black"]
    white_board = json_dict["white"]
    
    board = Board(black_board, white_board)
    pass_flag, end_flag = othello.check_pass(board, color)
    
    return jsonify(
        {
            "pass": pass_flag,
            "end": end_flag,
        }
    )

@app.route("/legal_move", methods=["GET", "POST"])
def get_legal_move():
    json_dict = request.get_json()
    color = json_dict["color"]
    black_board = json_dict["black"]
    white_board = json_dict["white"]

    board = Board(black_board, white_board)
    legal_moves = othello.get_leagal_moves(board, color)
    
    return jsonify(
        {
            "legal_move": legal_moves.to_list(), 
        }
    )

    
@app.route("/count", methods=["GET", "POST"])
def count():
    json_dict = request.get_json()
    black_board = json_dict["black"]
    white_board = json_dict["white"]
    
    board = Board(black_board, white_board)
    black_count, white_count = board.count()
    return jsonify(
        {
            "black_count": black_count,
            "white_count": white_count,
        }
    )


@app.route("/eval_score", methods=["GET", "POST"])
def get_eval_score():
    json_dict = request.get_json()
    
    color = json_dict["color"]
    black_board = json_dict["black"]
    white_board = json_dict["white"]
    ai_name = json_dict["ai_name"]
    ai = ai_container.get(ai_name, args)

    
    board = Board(black_board, white_board)
    score_board = ai.calc_score(board, color)
    
    return jsonify(
        {
            "score_board": score_board.to_list(), 
        }

    )



def add_global_setting_args(parent_parser):
    parser = parent_parser.add_argument_group("global_setting")
    parser.add_argument("--seed", help="Selegct random seed", type=int, default=42)
    parser.add_argument("--port", help="Selegct port number", type=int, default=61699)
    parser.add_argument("--not_debug", help="Use debug mode", action='store_true')
    return parent_parser



def main(args):
    app.run(
        host="0.0.0.0",
        port=args.port,
        debug=not args.not_debug,
        threaded=False,
    )

    
if __name__ == "__main__":
    parser = argparse.ArgumentParser()    
    parser = add_global_setting_args(parser)
    parser = AIContainer.add_args(parser)
    global args
    args = parser.parse_args()
    main(args)
