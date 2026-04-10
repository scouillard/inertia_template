# frozen_string_literal: true

class InvitationsController < InertiaController
  skip_before_action :authenticate_user!, only: %i[show update google]
  before_action :require_admin!, only: :create
  before_action :set_invitation, only: %i[show update google]
  before_action :ensure_pending!, only: %i[show update google]

  def create
    invitation = current_user.sent_invitations.build(email: params[:email])

    if invitation.save
      UserMailer.invitation(invitation).deliver_later

      redirect_to settings_path, notice: "Invitation sent to #{invitation.email}."
    else
      users = User.order(:name).sort_by { |u| u.role_admin? ? 0 : 1 }
      pending_users = Invitation.pending.order(:created_at)

      render inertia: "settings/show", props: {
        users: users.as_json(only: %i[id name email role]),
        pending_invitations: pending_users.as_json(only: %i[id email created_at]),
        errors: { email: invitation.errors[:email].first }
      }, status: :unprocessable_entity
    end
  end

  def show
    render inertia: "invitations/show", props: {
      email: @invitation.email,
      token: @invitation.token
    }
  end

  def google
    session[:pending_invitation_token] = @invitation.token
    render html: <<~HTML.html_safe
      <!DOCTYPE html>
      <html>
      <body>
        <form id="f" method="post" action="#{user_google_oauth2_omniauth_authorize_path}">
          <input type="hidden" name="authenticity_token" value="#{form_authenticity_token}">
        </form>
        <script>document.getElementById('f').submit()</script>
      </body>
      </html>
    HTML
  end

  def update
    user = @invitation.accept!(user_params)

    sign_in(user)

    redirect_to root_path, notice: "Welcome to MyApp!", status: :see_other
  rescue ActiveRecord::RecordInvalid => e
    render inertia: "invitations/show", props: {
      email: @invitation.email,
      token: @invitation.token,
      errors: e.record.errors.messages.transform_values(&:first)
    }, status: :unprocessable_entity
  end

  private

  def set_invitation
    @invitation = Invitation.find_by!(token: params[:token])
  rescue ActiveRecord::RecordNotFound
    redirect_to new_user_session_path, alert: "Invitation not found."
  end

  def ensure_pending!
    redirect_to new_user_session_path, alert: "Invitation not found." unless @invitation.pending?
  end

  def user_params
    params.permit(:name, :password, :password_confirmation)
  end
end
