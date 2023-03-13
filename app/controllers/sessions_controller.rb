class SessionsController < ApplicationController
    def new
    end
  
    def create
      user = User.find_by(email: params[:email])
      if user #&& user.authenticate(params[:password])
        session[:user_id] = user.id
        #redirect_to notice: "Logged in!"
        render json: {
          status: :created,
          user: user
        }
      else
        flash.now.alert = "Email or password is invalid"
        render "new"
      end
    end
  
    def destroy
      session[:user_id] = nil
      redirect_to root_url, notice: "Logged out!"
    end
end
