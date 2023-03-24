class ApplicationController < ActionController::API
    include ActionController::MimeResponds
    respond_to :json
  
    private
  
    def authenticate_api_user!
      jwt_payload = decode_jwt
      @current_api_user = User.find(jwt_payload['user_id']) if jwt_payload
      render json: { message: 'Not Authorized' }, status: :unauthorized unless @current_api_user
    end
  
    def current_api_user
      @current_api_user
    end
  
    def api_user_signed_in?
      !!@current_api_user
    end
  
    def decode_jwt
      token = request.headers['Authorization']&.split('Bearer ')&.last
      return nil unless token
  
      JWT.decode(token, Rails.application.secrets.secret_key_base, true, { algorithm: 'HS256' }).first
    rescue JWT::DecodeError
      nil
    end
  end