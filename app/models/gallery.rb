class Gallery < ActiveRecord::Base
include Bootsy::Container
 mount_uploader :company_logo, ImageUploader
 #mount_uploader :image, ImageUploader
 validates :title, presence: true
 validates :paramlink, presence: true

 attr_accessor :crop_x, :crop_y, :crop_w, :crop_h, :rotation_angle, :zoom_w, :zoom_h, :zoom_x, :zoom_y, :drag_x, :drag_y

 belongs_to :category, :foreign_key =>"post_type_category_id"
 belongs_to :medium_category, :foreign_key =>"medium_category_id"

 
 has_many :images, as: :imageable, dependent: :destroy
 has_many :caption_image
 
 has_many :videos, as: :videoable, dependent: :destroy
 has_many :caption_video
 
  
 has_many :upload_videos, as: :uploadvideoable, dependent: :destroy
 has_many :caption_upload_video
 
 has_many :sketchfebs, as: :sketchfebable, dependent: :destroy
 has_many :marmo_sets, as: :marmosetable, dependent: :destroy
 
 
  has_many :tags, as: :tagable, dependent: :destroy

  belongs_to :user
 
 accepts_nested_attributes_for :images, reject_if: proc { |attributes| attributes['image'].blank? || attributes['image'].nil? }, allow_destroy: true 
 
 accepts_nested_attributes_for :videos, reject_if: proc { |attributes| attributes['video'].blank? || attributes['video'].nil? }, allow_destroy: true
 accepts_nested_attributes_for :upload_videos, reject_if: proc { |attributes| attributes['uploadvideo'].blank? || attributes['uploadvideo'].nil? }, allow_destroy: true
 accepts_nested_attributes_for :sketchfebs, reject_if: proc { |attributes| attributes['sketchfeb'].blank? || attributes['sketchfeb'].nil? }, allow_destroy: true
 accepts_nested_attributes_for :marmo_sets, reject_if: proc { |attributes| attributes['marmoset'].blank? || attributes['marmoset'].nil? }, allow_destroy: true
 
 accepts_nested_attributes_for :tags, reject_if: proc { |attributes| attributes['tag'].blank? || attributes['tag'].nil? }, allow_destroy: true

 VISIBILITY_TYPE = {'Public' => 0, 'Private' => 1}
 GET_VISIBILITY_TYPE = {0 => 'Public', 1 => 'Private'}

 PUBLISH_TYPE = {'Immediately' => 1, 'Schedule' => 0}
 GET_PUBLISH_TYPE = {1 => 'Immediately', 0 => 'Schedule'}

end
