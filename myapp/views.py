from django.shortcuts import render, HttpResponse ,redirect
from django.contrib.auth import authenticate, login 
from django.contrib.auth.models import User
from django.contrib import messages 
from .models import Todo
from .models import LeaveApplication
from datetime import datetime
from django.http import JsonResponse


def home(request):
    return render(request,"home.html")


def user_login(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        
        # Authenticate the user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)  # Log in the user and set the session
            return redirect('student_dashboard')  # Redirect to the dashboard after login
        else:
            messages.error(request, 'Invalid username or password')
            return redirect('login')  # If login fails, stay on the login page
    return render(request, 'login.html')

def register(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        mobile = request.POST.get('mobile')
        course = request.POST.get('course')
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Check if the username already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return redirect('register')

        # Create a new user
        user = User.objects.create_user(username=username, password=password)
        user.first_name = name  # Save the full name in the first_name field
        user.save()

        messages.success(request, 'Registration successful! You can now log in.')
        return redirect('login')

    return render(request, 'register.html')

def todos(request):
    items = Todo.objects.all()
    return render(request,"todos.html",{"todos":items})

# def student_dashboard(request):
#     return render(request, 'student_dashboard.html')

def student_dashboard(request):
    print(f"Current user: {request.user.username}") 
    if not request.user.is_authenticated:
        # If the user is not authenticated, redirect them to the login page
        return redirect('login')  # Make sure 'login' is the name of your login URL

    if request.method == "POST":
        if "editId" in request.POST:  # Handle editing an existing leave application
            edit_id = request.POST.get("editId")
            leave_type = request.POST.get("leaveType")
            date_from = request.POST.get("dateFrom")
            date_to = request.POST.get("dateTo")
            whole_day = bool(request.POST.get("wholeDay"))
            reason = request.POST.get("reason")

            try:
                leave_application = LeaveApplication.objects.get(id=edit_id, username=request.user.username)
                leave_application.leave_type = leave_type
                leave_application.leave_date_from = date_from
                leave_application.leave_date_to = date_to
                leave_application.whole_day = whole_day
                leave_application.reason = reason
                leave_application.save()

                return JsonResponse({'success': True, 'message': 'Leave application updated successfully'})
            except LeaveApplication.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Leave application not found'})
        else:  # Handle adding a new leave application
            leave_type = request.POST.get("leaveType")
            date_from = request.POST.get("dateFrom")
            date_to = request.POST.get("dateTo")
            whole_day = bool(request.POST.get("wholeDay"))
            reason = request.POST.get("reason")

            LeaveApplication.objects.create(
                username=request.user.username,
                leave_type=leave_type,
                leave_date_from=date_from,
                leave_date_to=date_to,
                whole_day=whole_day,
                reason=reason,
            )
            return JsonResponse({'success': True})

    # Fetch the leave applications for the logged-in user
    student_data = LeaveApplication.objects.filter(username=request.user.username)

    return render(request, "student_dashboard.html", {
        "student_data": student_data,
        "username": request.user.username
    })