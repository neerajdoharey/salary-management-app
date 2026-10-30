class CreateSolidQueueTables < ActiveRecord::Migration[8.1]
  def up
    load Rails.root.join("db/queue_schema.rb") unless table_exists?(:solid_queue_jobs)
  end

  def down
    %i[
      solid_queue_batch_executions
      solid_queue_batches
      solid_queue_semaphores
      solid_queue_scheduled_executions
      solid_queue_recurring_tasks
      solid_queue_recurring_executions
      solid_queue_ready_executions
      solid_queue_processes
      solid_queue_pauses
      solid_queue_jobs
      solid_queue_failed_executions
      solid_queue_claimed_executions
      solid_queue_blocked_executions
    ].each do |table|
      drop_table table, if_exists: true
    end
  end
end
