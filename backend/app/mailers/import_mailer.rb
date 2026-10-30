class ImportMailer < ApplicationMailer
  def import_completed(user, log_path_or_content)
    @user = user.is_a?(User) ? user : User.find_by(id: user)
    return unless @user

    content = if log_path_or_content.is_a?(String) && File.exist?(log_path_or_content)
                File.read(log_path_or_content)
              else
                log_path_or_content.to_s
              end

    @log_content = content
    attachments["import.log"] = content

    mail(
      to: @user.email,
      subject: "Bulk Employee Import Log - Completed"
    )
  end
end
