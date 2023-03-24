Rails.application.config.to_prepare do
    Devise::SessionsController.skip_before_action :verify_signed_out_user, raise: false
    Devise::SessionsController.skip_after_action :remove_auth_cookie, raise: false
  end