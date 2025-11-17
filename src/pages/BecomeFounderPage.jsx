import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/api/userApi';
import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Checkbox';
import toast from 'react-hot-toast';

export default function BecomeFounderPage() {
    const navigate = useNavigate();
    const { user, fetchUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isAlreadyFounder, setIsAlreadyFounder] = useState(false);

    // Check if user is already a founder
    useEffect(() => {
        if (user) {
            const hasFounderRole = user.roles?.some(role => role.name === 'FOUNDER');
            setIsAlreadyFounder(hasFounderRole);
        }
    }, [user]);

    const handleBecomeFounder = async () => {
        if (!acceptedTerms) {
            toast.error('Vui lòng đồng ý với điều khoản và điều kiện');
            return;
        }

        try {
            setLoading(true);
            const response = await userApi.becomeFounder();

            if (response?.data?.success) {
                toast.success('Chúc mừng! Bạn đã trở thành Creator!');

                // Refresh user data to get updated roles
                if (fetchUserData) {
                    await fetchUserData();
                }

                setIsAlreadyFounder(true);
            } else {
                toast.error('Không thể trở thành Creator');
            }
        } catch (error) {
            console.error('Error becoming founder:', error);
            toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký Creator');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = () => {
        navigate('/campaigns/create');
    };

    const handleGoToSettings = () => {
        navigate('/profile');
    };

    // Success screen - Already a founder
    if (isAlreadyFounder) {
        return (
            <div className="min-h-screen bg-[#2C2E3E] flex items-center justify-center px-4">
                <div className="w-full max-w-2xl">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="inline-block bg-white px-4 py-2 rounded">
                            <span className="text-xl font-bold text-[#2C2E3E]">Fundelio</span>
                        </div>
                    </div>

                    {/* Success Card */}
                    <div className="bg-[#383A4D] rounded-lg p-12 text-center">
                        {/* Check Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-[#00D9A6] flex items-center justify-center">
                                <Check className="w-10 h-10 text-white" strokeWidth={3} />
                            </div>
                        </div>

                        {/* Success Message */}
                        <h1 className="text-3xl font-bold text-[#00D9A6] mb-4">
                            Bạn đã là một Fundelio creator!
                        </h1>
                        <p className="text-gray-300 text-lg mb-8">
                            Hồ sơ creator của bạn đã sẵn sàng để sử dụng.
                        </p>

                        {/* Actions */}
                        <div className="space-y-4">
                            <Button
                                onClick={handleCreateProject}
                                variant="primary"
                                size="lg"
                                className="w-full bg-[#A6B3FF] hover:bg-[#8FA0FF] text-[#2C2E3E] font-semibold py-3 rounded-lg text-base"
                            >
                                TẠO DỰ ÁN ĐẦU TIÊN CỦA BẠN
                            </Button>

                            <div className="text-gray-400 text-sm">hoặc</div>

                            <button
                                onClick={handleGoToSettings}
                                className="text-[#00D9A6] hover:text-[#00F5B8] font-medium text-base transition-colors"
                            >
                                đi tới cài đặt creator
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Registration form
    return (
        <div className="min-h-screen bg-[#2C2E3E] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-4xl">
                {/* Logo */}
                <div className="mb-8">
                    <div className="inline-block bg-white px-4 py-2 rounded">
                        <span className="text-xl font-bold text-[#2C2E3E]">Fundelio</span>
                    </div>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-3">Trở thành một creator</h1>
                    <p className="text-gray-300 text-lg">
                        Hoàn thành các bước bên dưới để trở thành Fundelio creator và bắt đầu dự án đầu tiên của bạn.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-[#383A4D] rounded-lg p-8 space-y-8">
                    {/* Step 1 - Login Status */}
                    <div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-[#00D9A6] flex items-center justify-center">
                                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                    1. Đăng nhập / Đăng ký
                                    <Check className="w-6 h-6 text-[#00D9A6]" strokeWidth={3} />
                                </h2>
                                <p className="text-gray-300">
                                    Hồ sơ creator của bạn sẽ được liên kết với tài khoản Fundelio sau:{' '}
                                    <span className="font-semibold text-white">{user?.email || 'user@example.com'}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-600"></div>

                    {/* Step 2 - Terms and Conditions */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            2. Đồng ý với điều khoản và điều kiện
                        </h2>
                        <p className="text-gray-300 mb-6">
                            Vui lòng đọc và chấp nhận điều khoản sử dụng để tiếp tục.
                        </p>

                        {/* Terms Checkbox */}
                        <div className="bg-[#2C2E3E] rounded-lg p-6 mb-6">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <Checkbox
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="mt-1"
                                />
                                <span className="text-gray-300 leading-relaxed">
                                    Tôi đã đọc và đồng ý với{' '}
                                    <a
                                        href="/terms"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#00D9A6] hover:text-[#00F5B8] underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Điều khoản sử dụng
                                    </a>
                                    {' '}và{' '}
                                    <a
                                        href="/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#00D9A6] hover:text-[#00F5B8] underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Chính sách bảo mật
                                    </a>
                                    {' '}của Fundelio. Tôi hiểu rằng tôi cần tuân thủ các quy định này khi tạo và quản lý dự án.
                                </span>
                            </label>
                        </div>

                        {/* Continue Button */}
                        <div className="flex justify-end">
                            <Button
                                onClick={handleBecomeFounder}
                                disabled={!acceptedTerms || loading}
                                variant="primary"
                                size="lg"
                                className={`px-12 py-3 rounded-lg font-semibold text-base transition-all ${acceptedTerms && !loading
                                        ? 'bg-[#00D9A6] hover:bg-[#00F5B8] text-[#2C2E3E]'
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {loading ? 'ĐANG XỬ LÝ...' : 'TIẾP TỤC'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 text-center text-gray-400 text-sm">
                    <p>Bạn cần hỗ trợ? <a href="/contact" className="text-[#00D9A6] hover:text-[#00F5B8] underline">Liên hệ với chúng tôi</a></p>
                </div>
            </div>
        </div>
    );
}
