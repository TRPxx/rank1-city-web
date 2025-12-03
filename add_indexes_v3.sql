-- Add Indexes for Performance Optimization
-- Run this on your Slave Database (Port 3307)

USE `rank1city_web`;

-- Index for searching winners by item name
CREATE INDEX idx_lucky_draw_item_name ON lucky_draw_history(item_name);

-- Index for searching users by discord name
CREATE INDEX idx_prereg_discord_name ON preregistrations(discord_name);

-- Index for filtering transaction logs by action
CREATE INDEX idx_trans_action ON transaction_logs(action);

-- Index for searching gangs by name
CREATE INDEX idx_gang_name ON gangs(name);
