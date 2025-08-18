from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import News, NewsRead
from admin_staff.models import CustomUser


class NewsManagementView(APIView):
    def get(self, request):
        return Response(
            {
                "news": News.objects.all().values(
                    "id", "title", "text", "priority", "timestamp"
                )
            }
        )

    def post(self, request):
        data = request.data
        errors = []

        title = (data.get("title") or "").strip().capitalize()
        text = (data.get("text") or "").strip().lower()
        priority = (data.get("priority") or "normal").strip()

        if not title:
            errors.append({"title": "Title can't be empty"})
        if not text:
            errors.append({"text": "Text can't be empty"})
        if priority not in ["normal", "important", "urgent"]:
            errors.append(
                {"priority": "Priority can only be normal, important or urgent"}
            )

        if errors:
            return Response({"errors": errors}, status=status.HTTP_406_NOT_ACCEPTABLE)

        try:
            News.objects.create(title=title, text=text, priority=priority)
        except Exception as e:
            return Response({"error": str(e)})

        return Response({"status": "success", "message": "News created "})


class NewsEditAndGetView(APIView):
    def get(self, request, news_id):
        try:
            news = News.objects.get(id=news_id)
        except News.DoesNotExist:
            return Response(
                {"error": f"News for id: '{news_id}' doesn't exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        user = CustomUser.objects.filter(role="student").first()
        try:
            NewsRead.objects.create(
                user=user,
                news=news,
                is_read=True,
            )
        except Exception as e:
            return Response(str(e))

        return Response(
            {
                "news": News.objects.filter(id=news_id)
                .values("title", "text", "priority", "timestamp")
                .first()
            },
            status=status.HTTP_201_CREATED,
        )

    def put(self, request, news_id):
        try:
            news = News.objects.get(id=news_id)
        except News.DoesNotExist:
            return Response(
                {"error": f"News for id: '{news_id}' doesn't exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = request.data
        errors = []

        title = (data.get("title") or "").strip().capitalize()
        text = (data.get("text") or "").strip().lower()
        priority = (data.get("priority") or "").strip()

        if not title:
            errors.append({"title": "Title can't be empty"})
        if not text:
            errors.append({"text": "Text can't be empty"})
        if priority not in ["normal", "important", "urgent"]:
            errors.append(
                {"priority": "Priority can only be normal, important or urgent"}
            )

        if errors:
            return Response({"errors": errors}, status=status.HTTP_406_NOT_ACCEPTABLE)

        news.title = title
        news.text = text
        news.priority = priority
        news.save()

        return Response({"status": "success", "message": "News updated"})

    def patch(self, request, news_id):
        try:
            news = News.objects.get(id=news_id)
        except News.DoesNotExist:
            return Response(
                {"error": f"News for id: '{news_id}' doesn't exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = request.data

        if "title" in data:
            news.title = data["title"].strip().capitalize()
        if "text" in data:
            news.text = data["text"].strip().lower()
        if "priority" in data:
            if data["priority"].strip() in ["normal", "important", "urgent"]:
                news.priority = data["priority"].strip()
            else:
                return Response(
                    {"error": "Priority can only be normal, important or urgent"},
                    status=status.HTTP_406_NOT_ACCEPTABLE,
                )

        news.save()
        return Response({"status": "success", "message": "News partially updated"})
