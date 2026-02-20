# Reorganize frontend folder structure
# This script will move src folder and related files into a standard frontend structure

$projectRoot = "c:\FullStack__New\Project\Printduf"
$frontendDir = Join-Path $projectRoot "frontend"
$srcDir = Join-Path $projectRoot "src"
$publicDir = Join-Path $projectRoot "public"

Write-Host "=== Frontend Folder Restructuring ===" -ForegroundColor Green
Write-Host ""

# Check if frontend directory exists
if (!(Test-Path $frontendDir)) {
    Write-Host "Creating frontend directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $frontendDir -Force | Out-Null
}

# Create src inside frontend if it doesn't exist
$newSrcDir = Join-Path $frontendDir "src"
if (!(Test-Path $newSrcDir)) {
    Write-Host "Creating frontend/src directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $newSrcDir -Force | Out-Null
}

# Create public inside frontend if it doesn't exist
$newPublicDir = Join-Path $frontendDir "public"
if (!(Test-Path $newPublicDir)) {
    Write-Host "Creating frontend/public directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $newPublicDir -Force | Out-Null
}

# Move files from root src/ into frontend/src/
if (Test-Path $srcDir) {
    Write-Host "Moving files from src/ to frontend/src/..." -ForegroundColor Cyan
    Get-ChildItem -Path $srcDir -Recurse | ForEach-Object {
        $relativePath = $_.FullName.Substring($srcDir.Length + 1)
        $dest = Join-Path $newSrcDir $relativePath
        
        if ($_.PSIsContainer) {
            if (!(Test-Path $dest)) {
                New-Item -ItemType Directory -Path $dest -Force | Out-Null
            }
        } else {
            $destDir = Split-Path $dest
            if (!(Test-Path $destDir)) {
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            }
            Copy-Item -Path $_.FullName -Destination $dest -Force
            Write-Host "  Copied: $relativePath" -ForegroundColor Green
        }
    }
}

# Move component folders to frontend/src if they exist in /frontend directory
$componentsDir = Join-Path $frontendDir "components"
$adminDir = Join-Path $frontendDir "admin"
$userDir = Join-Path $frontendDir "user"

if (Test-Path $componentsDir) {
    $dest = Join-Path $newSrcDir "components"
    if (!(Test-Path $dest)) {
        Write-Host "Moving frontend/components to frontend/src/components..." -ForegroundColor Cyan
        Move-Item -Path $componentsDir -Destination $dest -Force
    }
}

if (Test-Path $adminDir) {
    $dest = Join-Path $newSrcDir "admin"
    if (!(Test-Path $dest)) {
        Write-Host "Moving frontend/admin to frontend/src/admin..." -ForegroundColor Cyan
        Move-Item -Path $adminDir -Destination $dest -Force
    }
}

if (Test-Path $userDir) {
    $dest = Join-Path $newSrcDir "user"
    if (!(Test-Path $dest)) {
        Write-Host "Moving frontend/user to frontend/src/user..." -ForegroundColor Cyan
        Move-Item -Path $userDir -Destination $dest -Force
    }
}

# Move index.html and vite.config.js to frontend root if they exist at project root
$indexHtml = Join-Path $projectRoot "index.html"
$viteConfig = Join-Path $projectRoot "vite.config.js"
$packageJson = Join-Path $projectRoot "package.json"
$envExample = Join-Path $projectRoot ".env.example"

if (Test-Path $indexHtml) {
    if (!(Test-Path (Join-Path $frontendDir "index.html"))) {
        Write-Host "Moving index.html to frontend/..." -ForegroundColor Cyan
        Copy-Item -Path $indexHtml -Destination (Join-Path $frontendDir "index.html") -Force
    }
}

if (Test-Path $viteConfig) {
    if (!(Test-Path (Join-Path $frontendDir "vite.config.js"))) {
        Write-Host "Moving vite.config.js to frontend/..." -ForegroundColor Cyan
        Copy-Item -Path $viteConfig -Destination (Join-Path $frontendDir "vite.config.js") -Force
    }
}

# Copy public folder contents if exists
if (Test-Path $publicDir) {
    Write-Host "Copying public folder contents to frontend/public/..." -ForegroundColor Cyan
    Get-ChildItem -Path $publicDir | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination (Join-Path $newPublicDir $_.Name) -Recurse -Force
    }
}

Write-Host ""
Write-Host "=== Restructuring Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "New folder structure:" -ForegroundColor Yellow
Write-Host "frontend/"
Write-Host "  src/"
Write-Host "    admin/"
Write-Host "    components/"
Write-Host "    user/"
Write-Host "    context/"
Write-Host "    lib/"
Write-Host "    App.css"
Write-Host "    App.jsx"
Write-Host "    main.jsx"
Write-Host "    supabase.js"
Write-Host "  public/"
Write-Host "  index.html"
Write-Host "  vite.config.js"
Write-Host "  package.json"
Write-Host ""
