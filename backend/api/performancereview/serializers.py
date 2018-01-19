from django.contrib.auth.models import User
from rest_framework import serializers
from performancereview.models import PerformanceReview, ReviewFeedback


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'password')
    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializerPut(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'email', 'password')
    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class PerformanceReviewSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PerformanceReview
        fields = ('url', 'reviewee')

class PerformanceReviewSerializerGet(serializers.HyperlinkedModelSerializer):
    class Meta:
        depth = 2
        model = PerformanceReview
        fields = ('url', 'reviewee', 'reviewfeedback_set', 'pk')

class PerformanceReviewSerializerPut(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PerformanceReview
        fields = ('url',)

class ReviewFeedbackSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = ReviewFeedback
        fields = ('url', 'reviewer', 'feedback', 'performanceReview')
    def validate(self, data):
        """
        Check that the reviewer is not an admin and not the reviewee
        """
        reviewer = data['reviewer']
        reviewee = data['performanceReview'].reviewee
        if reviewer.is_staff or reviewer.pk == reviewee.pk:
            raise serializers.ValidationError("Invalid reviewer")
        return data

class ReviewFeedbackSerializerGet(serializers.HyperlinkedModelSerializer):

    class Meta:
        depth = 2
        model = ReviewFeedback
        fields = ('url', 'reviewer', 'feedback', 'performanceReview')


class ReviewFeedbackSerializerPut(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReviewFeedback
        fields = ('url', 'feedback')
