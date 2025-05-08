from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.utils.translation import gettext_lazy as _
from .models import Contact, Newsletter

class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ['name', 'email', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Your Name',
                'id': 'floatingName'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Your Email',
                'id': 'floatingEmail'
            }),
            'subject': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Subject',
                'id': 'floatingSubject'
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Your Message',
                'rows': 5,
                'id': 'floatingMessage',
                'style': 'height: 120px;'
            }),
        }

class NewsletterForm(forms.ModelForm):
    class Meta:
        model = Newsletter
        fields = ['email']
        widgets = {
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter your email address',
                'aria-label': 'Email address',
                'aria-describedby': 'subscribe-btn',
                'autocomplete': 'email',
                'required': True
            }),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if Newsletter.objects.filter(email=email).exists():
            raise forms.ValidationError('This email is already subscribed to our newsletter.')
        return email


class SuperAdminLoginForm(AuthenticationForm):
    """
    Form for super admin login with additional remember me field.
    """
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': _('Username or Email'),
                'autofocus': True,
                'autocomplete': 'username',
            }
        )
    )
    password = forms.CharField(
        strip=False,
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': _('Password'),
                'autocomplete': 'current-password',
            }
        ),
    )
    remember_me = forms.BooleanField(
        required=False,
        initial=False,
        widget=forms.CheckboxInput(
            attrs={
                'class': 'form-check-input',
            }
        )
    )

    error_messages = {
        'invalid_login': _(
            "Please enter a correct %(username)s and password. Note that both "
            "fields may be case-sensitive."
        ),
        'inactive': _("This account is inactive."),
    }

    def confirm_login_allowed(self, user):
        """
        Override to check if user is a superuser.
        """
        super().confirm_login_allowed(user)
        if not user.is_superuser:
            raise forms.ValidationError(
                _("You don't have super admin privileges."),
                code='no_superuser_privileges',
            )
