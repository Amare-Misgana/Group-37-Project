from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import News


def index(request):
    return JsonResponse({"message": "News Index Page"})


@login_required
def test_websocket(request):
    """Simple endpoint to test WebSocket connection"""
    return JsonResponse(
        {
            "message": "WebSocket test endpoint",
            "user_role": request.user.role,
            "user_id": request.user.id,
            "websocket_url": f"ws://{request.get_host()}/ws/news/",
        }
    )


@login_required
def news_list(request):
    """Display news based on user role"""
    if request.user.role == "admin_staff":
        news = News.objects.filter(is_published=True)
    else:
        news = News.objects.filter(
            is_published=True, target_roles__in=[request.user.role, "all"]
        )

    news_data = [
        {
            "id": item.pk,
            "title": item.title,
            "content": item.content,
            "author": f"{item.author.first_name} {item.author.last_name}",
            "target_roles": item.target_roles,
            "created_at": item.created_at.isoformat(),
        }
        for item in news[:20]
    ]

    return JsonResponse(
        {"news_list": news_data, "user_role": request.user.role, "count": len(news_data)}
    )