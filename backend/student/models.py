from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    Field_of_study = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name
