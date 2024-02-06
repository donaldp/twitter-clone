import AppLayout from "@/Layouts/AppLayout";
import Tweet from "@/Components/Tweet";

type Props = {
    user: any;
    tweet: {
        id: number;
        user_name: string;
        user_username: string;
        content: string;
        created_at: string;
    };
};

export default function Show(props: Props) {
    return (
        <AppLayout user={props.user}>
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    <Tweet tweet={props.tweet} />
                </div>
            </div>
        </AppLayout>
    );
}
