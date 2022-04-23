from django.db import models



class Quiz(models.Model):
    quiz_name = models.CharField(max_length=50)

    def __str__(self):
        return self.quiz_name



class Question(models.Model):
    question_text = models.CharField(max_length=50)
    right_answer = models.IntegerField()
    answer1 = models.CharField(null=True, max_length=50)
    answer2 = models.CharField(null=True, max_length=50)
    answer3 = models.CharField(null=True, max_length=50)
    answer4 = models.CharField(null=True, max_length=50)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")

    def __str__(self):
        return self.question_text