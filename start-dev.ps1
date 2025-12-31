# Load environment variables from .env file
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $name = $matches[1]
        $value = $matches[2]
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}

# Start the development servers
npx concurrently -n shared,backend,frontend -c yellow,green,cyan "npm run dev -w @optiq/shared" "npm run dev -w @optiq/backend" "npm run dev -w @optiq/frontend"
