class JobCategory < ActiveRecord::Base
	validates :name, presence: true
end
