class Users::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    begin
      user = User.find_by!(email: params[:user][:email])

      if user.valid_password?(params[:user][:password])
        token = JWT.encode({ user_id: user.id }, Rails.application.secrets.secret_key_base)
        render json: { message: "Logged in successfully.", accessToken: token, user: user }, status: :ok
      else
        render json: { message: "Invalid email or password." }, status: :unauthorized
      end
    rescue Mongoid::Errors::DocumentNotFound
      render json: { message: "User does not exist." }, status: :not_found
    end
  end

  def destroy
    # No es necesario eliminar la sesión en JWT ya que no se utilizan cookies
    render json: { message: "No active session." }, status: :unauthorized
  end
end