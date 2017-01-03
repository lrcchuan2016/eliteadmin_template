class ApplicationController < ActionController::Base
  	helper Bootsy::Engine.helpers
  	protect_from_forgery with: :exception
  	
  	skip_before_filter :verify_authenticity_token, if: -> { controller_name == 'sessions' && (action_name == 'create' || action_name == 'destroy')}
  	before_action :configure_permitted_parameters, if: :devise_controller?
  	before_action :set_message, if: -> { controller_name == 'sessions' && action_name == 'new'}
  	#before_action :check_admin, if: -> { controller_path =~ /admin/ && controller_name != 'sessions' && controller_name != 'passwords'}
  
    before_filter :ensure_signup_complete, only: [:new, :create, :update, :destroy]

  	def configure_permitted_parameters
	    if params[:user].present? &&  params[:user][:image].present?
	      params[:user][:image_attributes] = params[:user][:image]
	    end
	    devise_parameter_sanitizer.for(:sign_up).push(:firstname, :lastname, :username, :email, :password, :captcha, :captcha_key, :profile_type)
	end

 	def after_sign_in_path_for (resource)
 		
		if resource.is_a?(AdminUser)
			admin_root_path
		else
			stored_location_for(resource) || gallery_all_gallery_post_path
		end
	end

	def set_message
    	if params[:guest_user] == "true"
    		flash[:error] = "Please login to access this area."
    	end
  	end


	def ensure_signup_complete
		redirect_to root_path
	    # Ensure we don't go into an infinite loop
	  /  return if action_name == 'finish_signup'

	    # Redirect to the 'finish_signup' page if the user
	    # email hasn't been verified yet
	    if current_user && !current_user.email_verified?
	      redirect_to finish_signup_path(current_user)
	    end /
	end


	private
		def check_admin
			unless current_admin_user.present?
				redirect_to new_admin_user_session_path
			end
		end
  
end
