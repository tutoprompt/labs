const fs = require('fs');
const path = require('path');

// O termo correto em Node.js é __dirname
const projectsDir = path.join(__dirname, 'Projects');
const outputFile = path.join(__dirname, 'index.json');

function generateIndex() {
    // Verifica se a pasta Projects existe para evitar erros
    if (!fs.existsSync(projectsDir)) {
        console.error('Erro: A pasta Projects não foi encontrada!');
        return;
    }

    const files = fs.readdirSync(projectsDir);
    const projects = files
        .filter(file => file.endsWith('.html'))
        .map(file => {
            // Remove a extensão e substitui underscores por espaços para o título
            const name = file.replace('.html', '').replace(/_/g, ' ');
            return {
                title: name,
                url: `Projects/${file}`
            };
        });

    fs.writeFileSync(outputFile, JSON.stringify(projects, null, 2));
    console.log(`index.json gerado com sucesso com ${projects.length} projetos!`);
}

generateIndex();
