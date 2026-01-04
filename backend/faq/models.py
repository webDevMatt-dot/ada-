from django.db import models

class FAQ(models.Model):
    CATEGORY_CHOICES = [
        ('General', 'General'),
        ('Services', 'Services'),
        ('Membership', 'Membership'),
        ('Beliefs', 'Beliefs'),
        ('Other', 'Other'),
    ]

    question = models.TextField()
    answer = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='General')
    order = models.IntegerField(default=0, help_text="Order of appearance")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.question
