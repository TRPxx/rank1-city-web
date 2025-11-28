-- sv_claim.lua (Server Side)

local WEB_API_URL = "http://localhost:3000/api/game/claim" -- เปลี่ยนเป็น IP จริงเมื่อขึ้น VPS
local API_TOKEN = "SECRET_KEY_IF_NEEDED"

RegisterCommand("redeem", function(source, args, rawCommand)
    local src = source
    local discordId = nil

    -- 1. Get Discord ID
    for k, v in ipairs(GetPlayerIdentifiers(src)) do
        if string.sub(v, 1, string.len("discord:")) == "discord:" then
            discordId = string.sub(v, 9) -- Remove 'discord:' prefix
            break
        end
    end

    if not discordId then
        TriggerClientEvent('chat:addMessage', src, { args = { "^1Error", "Discord ID not found. Please open Discord app." } })
        return
    end

    -- 2. Call Web API
    PerformHttpRequest(WEB_API_URL .. "?discord_id=" .. discordId, function(statusCode, response, headers)
        if statusCode == 200 then
            local data = json.decode(response)
            if data.items and #data.items > 0 then
                local claimIds = {}
                
                -- 3. Give Items
                for _, item in ipairs(data.items) do
                    -- Example: Give Money
                    if item.item_id == "uncommon_money" then
                        -- xPlayer.addMoney(1000) -- ESX Example
                        print("Giving Money to " .. GetPlayerName(src))
                    
                    -- Example: Give Item
                    elseif item.item_id == "starter_pack" then
                        -- xPlayer.addInventoryItem('bread', 1)
                        -- xPlayer.addInventoryItem('water', 1)
                        print("Giving Starter Pack to " .. GetPlayerName(src))
                    
                    else
                        print("Unknown Item: " .. item.item_id)
                    end

                    table.insert(claimIds, item.id)
                end

                -- 4. Mark as Claimed
                PerformHttpRequest(WEB_API_URL, function(postStatus, postRes, postHead)
                    if postStatus == 200 then
                        TriggerClientEvent('chat:addMessage', src, { args = { "^2Success", "You received " .. #data.items .. " items!" } })
                    end
                end, 'POST', json.encode({ claim_ids = claimIds }), { ["Content-Type"] = "application/json" })

            else
                TriggerClientEvent('chat:addMessage', src, { args = { "^3Info", "No pending rewards found." } })
            end
        else
            TriggerClientEvent('chat:addMessage', src, { args = { "^1Error", "Failed to connect to web server." } })
        end
    end, 'GET', "", { ["Content-Type"] = "application/json" })

end, false)
