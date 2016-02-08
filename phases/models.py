from django.db import models


PHASE_CHOICES = (
    (1, 'Phase 1'),
    (2, 'Phase 2'),
)


class Phase(models.Model):
    phase = models.IntegerField(choices=PHASE_CHOICES, default=1)

    def __str__(self):
        return str(self.phase)
