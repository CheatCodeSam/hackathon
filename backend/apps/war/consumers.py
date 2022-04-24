import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from .serializer import QuizSerializer
from rest_framework.renderers import JSONRenderer

from .models import Quiz

players = {}
number_of_answers = 0
got_it_right = []

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.username = self.scope['url_route']['kwargs']['username']
        self.alignment = self.scope['url_route']['kwargs']['stu_or_tea']
        self.quiz = self.room_name
        self.room_group_name = 'chat_%s' % self.room_name
        print(self.alignment)
        if self.alignment == "student":
            players[self.username] = 0

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    def get_questions(self):
        quiz = Quiz.objects.get(pk=self.room_name)
        return QuizSerializer(quiz).data

    async def receive(self, text_data):
        print(text_data)
        global got_it_right
        global number_of_answers
        global players


        text_data_json = json.loads(text_data)
        print(text_data_json)
        func = text_data_json['func']
        payload = text_data_json['payload']
        if (func == "startgame"):
            number_of_answers = 0
            await self.channel_layer.group_send(

                self.room_group_name,
                {
                    'type': 'start_game',
                    'message': payload
                }
            )
        elif (func == "progress"):
            got_it_right = []
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'progress',
                    'message': payload
                }
            )
        elif (func == "showanswer"):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'showanswer',
                    'message': got_it_right
                }
            )
        elif (func == "answer"):
            number_of_answers = number_of_answers + 1
            user = payload["name"]
            isRight = payload["isRight"]
            if isRight:
                got_it_right.append(user)
                players[user] = players[user] + 1
            print(players)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    
                    'type': 'answer',
                    'message': payload
                }
            )
        elif (func == "endgame"):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'endgame',
                    'message': players
                }
            )

    async def start_game(self, event):

        questions = await database_sync_to_async(self.get_questions)()

        await self.send(text_data=json.dumps({
            'func': "startgame",
            'startgame': questions
        }))

    async def progress(self, event):
        message = event['message']
        global number_of_answers
        number_of_answers = 0

        await self.send(text_data=json.dumps({
            'func': "progress",
            'progress': message
        }))

    async def answer(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'func': "answer",
            'number_of_answers': number_of_answers
        }))

    async def showanswer(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'func': "showanswer",
            "got_it_right": message
        }))

    async def endgame(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'func': "endgame",
            "endgame": message
        }))

    