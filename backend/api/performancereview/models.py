from django.db import models
from django.contrib.auth.models import User

class PerformanceReview(models.Model):
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return 'Review ' + str(self.pk) + ' for ' + str(self.reviewee)

class ReviewFeedback(models.Model):
    performanceReview = models.ForeignKey(PerformanceReview, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    feedback = models.TextField(blank=True)
    def __str__(self):
        return 'Feedback by ' + str(self.reviewer) + ' for review ' + str(self.performanceReview)
