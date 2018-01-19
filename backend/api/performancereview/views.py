from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from performancereview.models import PerformanceReview, ReviewFeedback
from rest_framework import viewsets, mixins
from rest_framework.reverse import reverse
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from performancereview.serializers import UserSerializer, PerformanceReviewSerializer, ReviewFeedbackSerializer, UserSerializerPut, PerformanceReviewSerializerGet, PerformanceReviewSerializerPut, ReviewFeedbackSerializerGet, ReviewFeedbackSerializerPut

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
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, IsAdminUser)

    def get_serializer_class(self):
        serializer_class = self.serializer_class

        if self.request.method == 'PUT':
            serializer_class = UserSerializerPut

        return serializer_class


class PerformanceReviewViewSet(NoUpdateViewSet):
    """
    API endpoint that allows performance reviews to be viewed or edited.
    """
    queryset = PerformanceReview.objects.all().order_by('reviewee__pk')
    serializer_class = PerformanceReviewSerializer
    permission_classes = (IsAuthenticated, IsAdminUser)

    def get_serializer_class(self):
        serializer_class = self.serializer_class

        if self.request.method == 'PUT':
            serializer_class = PerformanceReviewSerializerPut
        if self.request.method == 'GET':
            serializer_class = PerformanceReviewSerializerGet

        return serializer_class

    # custom method so we can create via username instead of resource url
    def create(self, request):
        reviewee = get_object_or_404(User, username=request.data['reviewee'])
        request.data['reviewee'] = UserSerializer(reviewee, context={ 'request': request }).data.get('url')
        return super().create(request)

# only admin to delete
# only allow reviewer to update
class ReviewFeedbackViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows individual review feedback to be viewed or edited.
    """
    queryset = ReviewFeedback.objects.all().order_by('reviewer__pk')
    serializer_class = ReviewFeedbackSerializer
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
            serializer_class = ReviewFeedbackSerializerPut
        if self.request.method == 'GET':
            serializer_class = ReviewFeedbackSerializerGet

        return serializer_class

    # custom method so we can create via username instead of resource url
    def create(self, request):
        reviewer = get_object_or_404(User, username=request.data['reviewer'])
        performanceReview = get_object_or_404(PerformanceReview, pk=request.data['performanceReviewId'])

        request.data['reviewer'] = UserSerializer(reviewer, context={ 'request': request }).data.get('url')
        request.data['performanceReview'] = PerformanceReviewSerializer(performanceReview, context={ 'request': request }).data.get('url')

        return super().create(request)
