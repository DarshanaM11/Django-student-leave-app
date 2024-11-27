from django.contrib import admin
from .models import LeaveApplication  # Import your model

@admin.register(LeaveApplication)
class LeaveApplicationAdmin(admin.ModelAdmin):
    list_display = ('username', 'leave_type', 'leave_date_from', 'leave_date_to', 'status', 'created_at')
    list_filter = ('status', 'leave_type')  # Add filters to narrow down results in the admin
    search_fields = ('username', 'reason')  # Enable search by username or reason
    actions = ['approve_leave', 'reject_leave']  # Custom admin actions

    # Action to approve leave
    def approve_leave(self, request, queryset):
        queryset.update(status='Approved')
    approve_leave.short_description = "Approve selected leave applications"

    # Action to reject leave
    def reject_leave(self, request, queryset):
        queryset.update(status='Rejected')
    reject_leave.short_description = "Reject selected leave applications"
