interface StaticPageProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export default function StaticPage({ title, subtitle, children }: StaticPageProps) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{title}</h1>
                {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>
            <div className="bg-white rounded-lg shadow p-8 prose max-w-none">
                {children}
            </div>
        </div>
    );
}
