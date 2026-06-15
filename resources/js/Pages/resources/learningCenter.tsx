import FooterComponent from "@/Components/home/Footer";
import { HeaderComponent } from "@/Components/home/Header";
import { UserLoggedProvider } from "@/contexts/loggedUser";
import { FormStateProvider } from "@/contexts/stateForm";
import { User } from "@/types";

const ResourceItem = ({ title, description, link, type }: { title: string, description: string, link: string, type: string }) => (
    <div className="p-4 border rounded-lg shadow hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
        {type === 'video' ? (
            <a href={link} target="_blank" className="text-blue-500 hover:underline">Assistir vídeo</a>
        ) : (
            <a href={link} className="text-blue-500 hover:underline">Ler mais</a>
        )}
    </div>
);

export default function LearningCenter(props: { auth: { user: User }, local: string }) {
    // Exemplo de lista de recursos, que poderia vir de uma API ou ser definida estaticamente
    const resources = [
        { title: "Como configurar seu PDV no SIGESC", description: "Um guia rápido para começar a usar o ponto de venda.", link: "/guias/configurar-pdv", type: "article" },
        { title: "Introdução ao SIGESC", description: "Assista ao nosso vídeo de introdução para novos usuários.", link: "https://www.youtube.com/watch?v=pwB3Reib6u0", type: "video" },
        // Mais recursos...
    ];

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={props.auth} />
                <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold text-center mb-8">Centro de Aprendizagem SIGESC</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resources.map((resource, index) => (
                            <ResourceItem key={index} {...resource} />
                        ))}
                    </div>
                </div>
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
};
