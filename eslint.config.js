export default [
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                document: 'readonly',
                window: 'readonly',
                fetch: 'readonly',
                FileReader: 'readonly',
                File: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off'
        }
    }
];
