import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function Privacy() {
  const { isAr } = useLang()

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', direction: isAr ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <Link to="/" style={{ color: '#c9a84c', fontSize: '13px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
          {isAr ? '← العودة للرئيسية' : '← Back to Home'}
        </Link>

        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#ffffff', marginBottom: '8px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>
          {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
        <p style={{ color: '#9a8570', fontSize: '14px', marginBottom: '40px' }}>
          {isAr ? 'آخر تحديث: يونيو 2026' : 'Last updated: June 2026'}
        </p>

        {[
          {
            title: isAr ? '1. المعلومات التي نجمعها' : '1. Information We Collect',
            body: isAr ? 'نجمع المعلومات التي تقدمها عند التسجيل، مثل عنوان البريد الإلكتروني واسم المستخدم. كما نجمع بيانات المعاملات والنشاط على المنصة.' : 'We collect information you provide when registering, such as email address and username. We also collect transaction data and activity on the platform.'
          },
          {
            title: isAr ? '2. كيف نستخدم معلوماتك' : '2. How We Use Your Information',
            body: isAr ? 'نستخدم معلوماتك لتشغيل المنصة، ومعالجة المعاملات، وتحسين خدماتنا، وإرسال إشعارات مهمة تتعلق بحسابك.' : 'We use your information to operate the platform, process transactions, improve our services, and send important notifications related to your account.'
          },
          {
            title: isAr ? '3. مشاركة المعلومات' : '3. Information Sharing',
            body: isAr ? 'لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية. قد نشارك البيانات الضرورية مع مزودي خدمات الدفع لإتمام المعاملات.' : 'We do not sell or share your personal information with third parties for marketing purposes. We may share necessary data with payment service providers to complete transactions.'
          },
          {
            title: isAr ? '4. أمان البيانات' : '4. Data Security',
            body: isAr ? 'نستخدم تشفير SSL وإجراءات أمنية صارمة لحماية بياناتك. مع ذلك، لا يمكن ضمان الأمان الكامل لأي نظام على الإنترنت.' : 'We use SSL encryption and strict security measures to protect your data. However, no internet system can guarantee complete security.'
          },
          {
            title: isAr ? '5. ملفات تعريف الارتباط' : '5. Cookies',
            body: isAr ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع وتذكر تفضيلاتك. يمكنك تعطيل ملفات تعريف الارتباط في إعدادات متصفحك.' : 'We use cookies to improve your experience on the site and remember your preferences. You can disable cookies in your browser settings.'
          },
          {
            title: isAr ? '6. حقوقك' : '6. Your Rights',
            body: isAr ? 'يحق لك الوصول إلى بياناتك الشخصية وتصحيحها أو حذفها في أي وقت. للقيام بذلك، يمكنك التواصل معنا عبر صفحة الدعم.' : 'You have the right to access, correct, or delete your personal data at any time. To do so, you can contact us through the support page.'
          },
          {
            title: isAr ? '7. تغييرات السياسة' : '7. Policy Changes',
            body: isAr ? 'قد نحدث سياسة الخصوصية هذه من وقت لآخر. سيتم إخطارك بأي تغييرات جوهرية عبر إشعار على المنصة.' : 'We may update this Privacy Policy from time to time. You will be notified of any material changes via a notice on the platform.'
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#c9a84c', marginBottom: '12px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>{section.title}</h2>
            <p style={{ fontSize: '15px', color: '#d4c5a9', lineHeight: '1.8' }}>{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}