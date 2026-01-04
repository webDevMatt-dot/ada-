from django.db import models

class HistoryEvent(models.Model):
    year = models.IntegerField(help_text="Year of the event (e.g. 1990)")
    title = models.CharField(max_length=255)
    description = models.TextField()

    class Meta:
        ordering = ['-year']

    def __str__(self):
        return f"{self.year} - {self.title}"
