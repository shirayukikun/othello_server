from .edax_ai import EdaxAI
from .random_ai import RandomAI
from .generic_algorithm_ai import GenericAlgorithmAI
from .bert_ai import BertAI


ai_cls_dict = {
    EdaxAI.name: EdaxAI,
    RandomAI.name: RandomAI,
    GenericAlgorithmAI.name: GenericAlgorithmAI,
    BertAI.name: BertAI,
}


class AIContainer:
    def __init__(self):
        self._container_dict = {}
        self.cls_dict = ai_cls_dict

    def get(self, ai_name:str, args):
        if not self.load(ai_name, args):
            raise NotImplementedError(f"{ai_name} AI is not implemented...")
        
        return self._container_dict[ai_name]
        

    def load(self, ai_name:str, args):
        if ai_name in self._container_dict:
            return True

        try:
            self._container_dict[ai_name] = self.cls_dict[ai_name](args)
        except KeyError:
            return False
        
        return True
        
    
    
    @staticmethod
    def add_args(parent_parser):
        parser = parent_parser.add_argument_group("AI_argumrnts")
        for cls in ai_cls_dict.values():
            parser = cls.add_args(parser)
        return parent_parser
