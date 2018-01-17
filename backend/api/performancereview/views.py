from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from performancereview.models import PerformanceReview, ReviewFeedback
from rest_framework import viewsets, mixins
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from performancereview.serializers import UserSerializer, PerformanceReviewSerializer, ReviewFeedbackSerializer, UserSerializerCreate, PerformanceReviewSerializerCreate, ReviewFeedbackSerializerCreate

class NoUpdateViewSet(mixins.RetrieveModelMixin,
                    mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    mixins.DestroyModelMixin,
                    viewsets.GenericViewSet):
    pass

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializerCreate
    permission_classes = (IsAuthenticated, IsAdminUser)

    def get_serializer_class(self):
        serializer_class = self.serializer_class

        if self.request.method == 'PUT':
            serializer_class = UserSerializer

        return serializer_class


class PerformanceReviewViewSet(NoUpdateViewSet):
    """
    API endpoint that allows performance reviews to be viewed or edited.
    """
    queryset = PerformanceReview.objects.all().order_by('reviewee__pk')
    serializer_class = PerformanceReviewSerializerCreate
    permission_classes = (IsAuthenticated, IsAdminUser)

    def get_serializer_class(self):
        serializer_class = self.serializer_class

        if self.request.method == 'PUT':
            serializer_class = PerformanceReviewSerializer

        return serializer_class

# only admin to delete
# only allow reviewer to update
class ReviewFeedbackViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows individual review feedback to be viewed or edited.
    """
    queryset = ReviewFeedback.objects.all().order_by('reviewer__pk')
    serializer_class = ReviewFeedbackSerializerCreate
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # if user is admin, return all
        if self.request.user.is_staff:
            return self.queryset
        # if user is not admin, fetch all where user = reviewer
        return ReviewFeedback.objects.filter(reviewer=self.request.user)


    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_destroy(self, instance):
        print(self.request.user)
        # allow admin to delete object
        if self.request.user.is_staff:
            super().perform_destroy(instance)
        else:
            # otherwise raise exception
            raise PermissionDenied

    def perform_create(self, serializer):
        # allow admin to create object
        print(self.request.user.is_staff)
        if self.request.user.is_staff:
            super().perform_create(serializer)
        else:
            # otherwise raise exception
            raise PermissionDenied

    def perform_update(self, serializer):
        # allow admin or reviewer to update object
        if self.request.user.is_staff or self.get_object():
            super().perform_update(serializer)
        else:
            # otherwise raise exception
            raise PermissionDenied


    def get_serializer_class(self):
        serializer_class = self.serializer_class

        if self.request.method == 'PUT':
            serializer_class = ReviewFeedbackSerializer

        return serializer_class
