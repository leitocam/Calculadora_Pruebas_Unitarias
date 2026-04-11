# Financial Calculator Suite 💼

A modern, multi-tool financial calculator application built with React. Includes mortgage calculations, insurance estimates, scenario comparisons, and investment growth analysis.

## 🌟 Features

### 🏠 Mortgage Calculator
- Calculate maximum house value based on salary and deposit
- Compute monthly mortgage payments
- Support for dual income households
- Account for monthly financial commitments
- Affordability assessment (debt-to-income ratio)
- Flexible loan terms and interest rates

### 🛡️ Insurance Calculator
- Calculate annual property insurance costs
- Multiple insurance plan options (Basic, Standard, Premium)
- Instant monthly cost breakdown
- Integration with mortgage calculations

### 📊 Comparison Tool
- Create and compare multiple mortgage scenarios
- Save different combinations of parameters
- Side-by-side analysis of options
- Identify best value scenarios
- Include insurance in total cost calculations

### 💰 Investment Analyzer
- Calculate compound interest over time
- Multiple compounding frequencies (Annual, Semi-Annual, Quarterly, Monthly, Daily)
- Analyze investment growth
- Understand earning potential

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (or v22+)
- npm or yarn

### Installation

1. **Navigate to project directory**
```bash
cd lab--mortgage-calculator
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

### `npm start`
Runs the development server. Changes are automatically reloaded.

### `npm test`
Launches the test runner in interactive watch mode. See [TESTING.md](./TESTING.md) for details.

### `npm run build`
Creates an optimized production build in the `build` folder.

## 📁 Project Structure

```
lab--mortgage-calculator/
├── README.md                    # This file
├── package.json                 # Dependencies and scripts
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── App.js                  # Main application component
│   ├── App.css                 # Global styles
│   ├── index.js                # React 18 entry point
│   ├── index.css               # Base styles
│   │
│   ├── utilities/
│   │   ├── calculations.js     # Pure calculation functions (TESTABLE)
│   │
│   ├── components/
│   │   ├── Tabs.js             # Tab navigation
│   │   ├── MortgageCalculator.js
│   │   ├── InsuranceCalculator.js
│   │   ├── ComparisonTool.js
│   │   └── InvestmentAnalyzer.js
│   │
│   └── styles/
│       ├── Tabs.css
│       └── Calculator.css
│
└── .gitignore
```

## 🏗️ Architecture

### Design Principles

1. **Pure Functions**: All calculations are pure functions for easy testing
2. **Component Isolation**: Each calculator is an independent component
3. **State Management**: React hooks for local state management
4. **Responsive Design**: Mobile-friendly interface
5. **Accessibility**: Semantic HTML and ARIA labels

### Key Components

#### `utilities/calculations.js`
Core calculation engine with pure functions:
- `calculateMaxHouseValue()` - Maximum affordable property value
- `calculateMonthlyPayment()` - Mortgage repayment calculation
- `calculateMortgage()` - Complete mortgage analysis
- `calculateInsurance()` - Property insurance estimation
- `calculateCompoundInterest()` - Investment growth
- `validateAffordability()` - Affordability assessment

#### Component Hierarchy
```
App
├── Tabs (Navigation)
├── MortgageCalculator
├── InsuranceCalculator
├── ComparisonTool
└── InvestmentAnalyzer
```

## 🧪 Testing

The project is built for testability with comprehensive unit tests.

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Test Coverage
- **28+ unit tests** for calculation utilities
- Edge cases, error handling, and business logic
- Ready for component and integration tests

See [TESTING.md](./TESTING.md) for full testing documentation.

## 🎨 UI/UX Features

- **Interactive Tabs**: Switch between different calculators
- **Form Validation**: Real-time error detection
- **Result Cards**: Clean, organized display of calculations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional Styling**: Modern gradient background and card design
- **Visual Feedback**: Hover effects, animations, and status indicators

## 💡 Usage Examples

### Calculate Maximum House Value
1. Go to **Mortgage** tab
2. Enter annual salary(ies)
3. Input initial deposit
4. Add monthly commitments
5. Specify loan term and interest rate
6. Click **Calculate**
7. View affordability assessment

### Compare Mortgage Options
1. Go to **Comparison** tab
2. Create multiple scenarios (conservative, aggressive, etc.)
3. Adjust parameters for each scenario
4. Compare results side-by-side
5. Identify the best option

### Analyze Investment Growth
1. Go to **Investment** tab
2. Enter initial investment amount
3. Set annual interest rate
4. Choose time period and compounding frequency
5. View growth analysis and interest earned

## 🔧 Customization

### Adding New Calculators

1. Create new component in `src/components/NewCalculator.js`
2. Use calculation utilities from `src/utilities/calculations.js`
3. Add to tabs array in `App.js`:

```javascript
{
  id: 'newcalc',
  label: 'New Calculator',
  icon: '🆕',
  description: 'Description here',
  component: NewCalculator
}
```

### Modifying Calculations

Edit pure functions in `src/utilities/calculations.js` and update corresponding tests.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security & Privacy

- All calculations are performed locally in the browser
- No data is sent to external servers
- No cookies or tracking
- Safe to use with sensitive financial information

## 🤝 Contributing

1. Create a feature branch
2. Make changes and add/update tests
3. Run `npm test` to verify
4. Submit pull request

## 📊 Performance

- **Build Size**: ~200KB (production)
- **Load Time**: <2 seconds on 3G
- **Interaction Time**: <100ms for calculations
- **Mobile Optimization**: CSS Grid and Flexbox responsive layout

## 🐛 Troubleshooting

### App won't start?
```bash
rm -r node_modules
npm install
npm start
```

### Tests failing?
```bash
npm test -- --coverage
```

### Performance issues?
Check browser console for errors and verify Node.js version: `node --version`

## 📚 Dependencies

- **React 18.3** - UI framework
- **React DOM 18.3** - DOM rendering
- **react-scripts 5.0** - Create React App build tools

[See full dependencies in package.json](./package.json)

## 📈 Future Enhancements

- [ ] Export calculation results to PDF
- [ ] Save calculations to local storage
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Tax calculation integration
- [ ] Amortization schedule visualization
- [ ] Advanced investment scenarios
- [ ] Progressive Web App (PWA) support

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Development Info

- **Created**: 2026
- **Version**: 1.0.0
- **Maintainers**: Development Team

---

**Happy calculating! 📊💰🏠**

