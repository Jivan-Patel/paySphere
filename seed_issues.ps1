$issues = @(
    @{
        title = "Add 'Forgot Password' functionality"
        body = "Currently, there is no way for users to reset their password if they forget it. We need to implement a 'Forgot Password' flow using email verification."
        labels = "help wanted,good first issue"
    },
    @{
        title = "Improve Mobile Responsiveness on Dashboard"
        body = "The dashboard tables overflow on small mobile screens. Let's make the tables horizontally scrollable or switch to a card-based layout on mobile devices."
        labels = "good first issue,frontend"
    },
    @{
        title = "Add pagination to Employee List"
        body = "As the number of employees grows, loading them all at once on the dashboard will slow down the app. Implement pagination (e.g., 10 employees per page) on both frontend and backend."
        labels = "help wanted,fullstack"
    },
    @{
        title = "Unit tests for payroll calculation logic"
        body = "The core logic that calculates Net Salary based on base pay, leave, overtime, and deductions needs unit tests to ensure accuracy. We can use Jest for this."
        labels = "good first issue,testing"
    },
    @{
        title = "Export Payslips in CSV format"
        body = "We currently support PDF payslips. It would be helpful to also allow admins to export payslips and payroll reports as CSV files for spreadsheet software."
        labels = "help wanted,backend"
    },
    @{
        title = "Add Dark Mode toggle"
        body = "Many users prefer dark mode. Let's add a toggle to switch between light and dark themes using Tailwind's dark mode support."
        labels = "good first issue,frontend"
    },
    @{
        title = "Tooltip for Overtime Calculation"
        body = "On the dashboard, it's not clear how the overtime amount is calculated. Add a small 'i' tooltip next to the overtime column that shows the hourly rate and hours worked."
        labels = "good first issue,frontend"
    },
    @{
        title = "Validate Employee phone numbers on creation"
        body = "When adding a new employee, we should validate that the phone number matches standard formats (e.g. 10 digits for India)."
        labels = "good first issue,backend"
    },
    @{
        title = "Add confirmation modal for deleting an employee"
        body = "Currently, deleting an employee happens immediately when clicking the delete button. We should add a confirmation modal to prevent accidental deletions."
        labels = "good first issue,frontend"
    },
    @{
        title = "Allow bulk upload of employees via CSV"
        body = "Small businesses might already have employee lists in Excel. Implement a feature to allow bulk importing of employees using a CSV file upload."
        labels = "help wanted,fullstack"
    },
    @{
        title = "Add empty state illustrations"
        body = "When there are no employees or no activity logged, the dashboard looks very empty. Let's add some nice illustrations or messages to guide the user on what to do next."
        labels = "good first issue,UI/UX"
    },
    @{
        title = "Implement rate limiting for Authentication APIs"
        body = "To prevent brute-force attacks, we should add rate limiting to our login and signup endpoints using express-rate-limit."
        labels = "help wanted,backend,security"
    },
    @{
        title = "Setup Prettier and ESLint Husky hooks"
        body = "We want to ensure code consistency across contributors. Set up husky pre-commit hooks to automatically format code with Prettier and lint with ESLint before allowing a commit."
        labels = "good first issue,tooling"
    },
    @{
        title = "Add 'Loading' skeletons for dashboard data"
        body = "Instead of showing a simple spinner while data is being fetched, let's show modern skeleton loaders to improve perceived performance."
        labels = "good first issue,frontend"
    },
    @{
        title = "Create a 'Getting Started' video tutorial link on Dashboard"
        body = "Add a small card or banner on the dashboard linking to our YouTube tutorial so new users know how to use the platform."
        labels = "good first issue,frontend"
    }
)

Write-Host "Creating issues..."

foreach ($issue in $issues) {
    Write-Host "Creating issue: $($issue.title)"
    gh issue create --title $issue.title --body $issue.body --label $issue.labels
}

Write-Host "Finished creating 15 issues!"
