import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function Terms() {
  const { isAr } = useLang()

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', direction: isAr ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <Link to="/" style={{ color: '#c9a84c', fontSize: '13px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
          {isAr ? '← العودة للرئيسية' : '← Back to Home'}
        </Link>

        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#ffffff', marginBottom: '8px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>
          {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
        </h1>
        <p style={{ color: '#9a8570', fontSize: '14px', marginBottom: '40px' }}>
          {isAr ? 'آخر تحديث: يونيو 2026' : 'Last updated: June 2026'}
        </p>

        {[
          {
            title: isAr ? '1. قبول الشروط' : '1. Acceptance of Terms',
            body: isAr ? 'باستخدامك لموقع سوق.gg، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام الموقع.' : 'By using Sooq.gg, you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, please do not use the platform.'
          },
          {
            title: isAr ? '2. وصف الخدمة' : '2. Description of Service',
            body: isAr ? 'سوق.gg هو سوق رقمي يربط المشترين والبائعين لتداول المنتجات الرقمية المتعلقة بالألعاب، بما في ذلك شحن الرصيد، والحسابات، والعملات الرقمية، والآيتمز.' : 'Sooq.gg is a digital marketplace connecting buyers and sellers for gaming-related digital products, including top-ups, accounts, in-game currency, and items.'
          },
          {
            title: isAr ? '3. نظام الضمان (Escrow)' : '3. Escrow System',
            body: isAr ? 'نستخدم نظام الضمان لحماية المشترين والبائعين. يتم الاحتفاظ بالأموال حتى يؤكد المشتري استلام المنتج. لا يتم تحرير الأموال للبائع حتى اكتمال الصفقة بنجاح.' : 'We use an escrow system to protect both buyers and sellers. Funds are held until the buyer confirms receipt of the product. Funds are not released to the seller until the transaction is successfully completed.'
          },
          {
            title: isAr ? '4. مسؤوليات المستخدم' : '4. User Responsibilities',
            body: isAr ? 'يتحمل المستخدمون مسؤولية ضمان أن المنتجات المدرجة للبيع مشروعة ولا تنتهك شروط خدمة أي لعبة. سوق.gg غير مسؤول عن أي حظر أو عقوبات ناجمة عن انتهاك شروط اللعبة.' : 'Users are responsible for ensuring that products listed for sale are legitimate and do not violate any game\'s terms of service. Sooq.gg is not responsible for any bans or penalties resulting from violations of game terms.'
          },
          {
            title: isAr ? '5. الرسوم والعمولات' : '5. Fees and Commissions',
            body: isAr ? 'يتقاضى سوق.gg عمولة بنسبة 7% على كل صفقة مكتملة. التسجيل والإدراج مجاني تماماً. يتم خصم العمولة تلقائياً عند إتمام الصفقة.' : 'Sooq.gg charges a 7% commission on each completed transaction. Registration and listing are completely free. The commission is automatically deducted upon transaction completion.'
          },
          {
            title: isAr ? '6. سياسة الاسترداد' : '6. Refund Policy',
            body: isAr ? 'إذا لم يستلم المشتري المنتج أو كان المنتج لا يطابق الوصف، يحق له طلب استرداد الأموال خلال 24 ساعة من الشراء. يتم مراجعة كل طلب استرداد بشكل فردي.' : 'If a buyer does not receive the product or the product does not match the description, they are entitled to request a refund within 24 hours of purchase. Each refund request is reviewed individually.'
          },
          {
            title: isAr ? '7. المدفوعات بالكريبتو' : '7. Crypto Payments',
            body: isAr ? 'نقبل المدفوعات بالعملات الرقمية فقط. المعاملات على البلوكتشين لا رجعة فيها، لذا يرجى التحقق من جميع التفاصيل قبل إتمام الدفع.' : 'We accept cryptocurrency payments only. Blockchain transactions are irreversible, so please verify all details before completing payment.'
          },
          {
            title: isAr ? '8. حظر الحسابات' : '8. Account Suspension',
            body: isAr ? 'نحتفظ بالحق في تعليق أو إنهاء أي حساب ينتهك هذه الشروط، أو يمارس أي نشاط احتيالي، أو يضر بمستخدمين آخرين.' : 'We reserve the right to suspend or terminate any account that violates these terms, engages in fraudulent activity, or harms other users.'
          },
          {
            title: isAr ? '9. تحديد المسؤولية' : '9. Limitation of Liability',
            body: isAr ? 'سوق.gg ليس مسؤولاً عن أي خسائر غير مباشرة أو عرضية ناجمة عن استخدام المنصة. مسؤوليتنا القصوى تقتصر على قيمة الصفقة المعنية.' : 'Sooq.gg is not liable for any indirect or incidental losses arising from the use of the platform. Our maximum liability is limited to the value of the transaction in question.'
          },
          {
            title: isAr ? '10. تغييرات الشروط' : '10. Changes to Terms',
            body: isAr ? 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على الموقع.' : 'We reserve the right to modify these terms at any time. Users will be notified of any material changes via email or a notice on the platform.'
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#c9a84c', marginBottom: '12px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>{section.title}</h2>
            <p style={{ fontSize: '15px', color: '#d4c5a9', lineHeight: '1.8' }}>{section.body}</p>
          </div>
        ))}

        <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
          <p style={{ color: '#9a8570', fontSize: '14px', marginBottom: '16px' }}>
            {isAr ? 'هل لديك أسئلة حول شروطنا؟' : 'Have questions about our terms?'}
          </p>
          <a href="mailto:support@sooqgg.com" style={{ color: '#c9a84c', fontWeight: '700', fontSize: '14px' }}>
            support@sooqgg.com
          </a>
        </div>
      </div>
    </div>
  )
}