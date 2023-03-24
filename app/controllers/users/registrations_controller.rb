class Users::RegistrationsController < Devise::RegistrationsController
    respond_to :json
  
    # Añade estos dos métodos para anular el comportamiento predeterminado de Devise:
    def sign_up(resource_name, resource)
        # No hagas nada para evitar que Devise intente iniciar sesión con las sesiones.
    end

    def sign_in(resource_name, resource)
        # No hagas nada para evitar que Devise intente iniciar sesión con las sesiones.
    end

    private
  
    def sign_up_params
      params.require(:user).permit(:username, :email, :password, :admin)
    end
  
    def respond_with(resource, _opts = {})
    puts "Resource: #{resource.inspect}"
    if resource.persisted?
      # Reemplaza 'current_api_user' con 'resource'
      register_success(resource)
    else
      register_failed
    end
  end

  # Reemplaza 'current_api_user' con 'resource'
  def register_success(resource)
    render json: {
      message: 'User created successfully, please log in',
      user: resource
    }, status: :ok
  end
  
    def register_failed
      render json: { error: 'Registration failed' }, status: :unprocessable_entity
    end
  end