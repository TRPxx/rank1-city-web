# sync-items-images.ps1
# Script to sync item images from Game Resource to Web Project

$source = "C:\Users\Administrator\Desktop\Rank1 City\cfx-server-data\resources\[-Licence-]\[-Nc-]\nc_inventory\html\img\items"
$destination = "$PSScriptRoot\public\items"

Write-Host "🔄 Starting Item Images Sync..." -ForegroundColor Cyan
Write-Host "📁 Source: $source" -ForegroundColor Gray
Write-Host "📁 Destination: $destination" -ForegroundColor Gray

# Create destination folder if not exists
if (-not (Test-Path $destination)) {
    New-Item -ItemType Directory -Path $destination -Force | Out-Null
    Write-Host "✅ Created destination folder" -ForegroundColor Green
}

# Check if source exists
if (-not (Test-Path $source)) {
    Write-Host "❌ Error: Source folder not found!" -ForegroundColor Red
    Write-Host "   Please check the path: $source" -ForegroundColor Yellow
    exit 1
}

# Copy all images
Write-Host "📦 Copying images..." -ForegroundColor Cyan
try {
    Copy-Item -Path "$source\*" -Destination $destination -Recurse -Force
    
    $count = (Get-ChildItem $destination -File).Count
    $totalSize = (Get-ChildItem $destination -File | Measure-Object -Property Length -Sum).Sum / 1MB
    
    Write-Host "✅ Successfully synced $count items" -ForegroundColor Green
    Write-Host "📊 Total size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Gray
    Write-Host "🎉 Sync completed!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error during sync: $_" -ForegroundColor Red
    exit 1
}

# Optional: Optimize images with ImageMagick (uncomment if needed)
# Write-Host "`n🔧 Optimizing images..." -ForegroundColor Cyan
# Get-ChildItem "$destination\*.png" | ForEach-Object {
#     magick $_.FullName -strip -quality 85 $_.FullName
# }
# Write-Host "✅ Optimization complete!" -ForegroundColor Green
