ActiveAdmin.register Menu do

# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end

	permit_params :title,:parent_id,:url,:navigation_label,:position,:is_custom_link,:pagename,:menulocation
	
	form multipart: true do |f|
		
		f.inputs "Menu" do
			  f.input :title
			  f.input :navigation_label
			  f.input :parent_id, as: :select, collection: Menu.where("parent_id IS NULL ").pluck(:title, :id), include_blank: 'Select Parent'
			  f.input :is_custom_link, as: :boolean,label: "Is Custom URL?"
			  f.input :url
			  f.input :pagename, as: :select, collection: StaticPage.where("id IS NOT NULL ").pluck(:page_url, :page_url), include_blank: 'Select Page'
			  f.input :menulocation, as: :select, collection: [['Header','Header'],['Middle','Middle'],['Footer 1','Footer 1'],['Footer 2','Footer 2'],['Footer 3','Footer 3']], include_blank: 'Select Menu Location', label: 'Menu Location'
			  f.input :position
			 
		end
		
		f.actions
    end
  
  filter :title
  filter :url
  filter :navigation_label
  filter :menulocation, as: :select, collection:  [['Header','Header'],['Middle','Middle'],['Footer 1','Footer 1'],['Footer 2','Footer 2'],['Footer 3','Footer 3']], label: 'Menu Location'
  filter :parent_id, as: :select, collection: Menu.where("parent_id IS NULL ").pluck(:title, :id), label: 'Parent'
	

    	# Users List View
  index :download_links => ['csv'] do
		selectable_column

		column :title
		column :navigation_label
		column :parent do |cat|
		  Menu.find_by(id: cat.parent_id).try(:title)
		end
		column :is_custom_link
		column :url
		column :pagename
		column :menu_location do |cat|
		 cat.menulocation
		end
		
		column :position
		column :created_at
		actions
  end

	
	


end
