from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    bio = models.TextField()

class Todo(models.Model):
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class LeaveApplication(models.Model):
    username = models.CharField(max_length=100)
    leave_type = models.CharField(max_length=50)
    leave_date_from = models.DateField()
    leave_date_to = models.DateField()
    whole_day = models.BooleanField(default=False)
    reason = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=[
            ('Pending', 'Pending'),
            ('Approved', 'Approved'),
            ('Rejected', 'Rejected'),
        ],
        default='Pending',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.leave_type} ({self.status})"
    

    
    

