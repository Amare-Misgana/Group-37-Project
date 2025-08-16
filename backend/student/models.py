from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    score = models.FloatField(default=0)  # overall score

    def __str__(self):
        return self.name
