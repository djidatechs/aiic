import { createTranslation, getLocale } from "@/lib/i18n/server";

const AboutPage = async () => {
  const { t } = await createTranslation("common");
  const local = getLocale();

  let content;
  switch (local) {
    case 'fr':
      content = (
        <p>
          Bienvenue chez Elakhiar Immigration et Intégration, votre partenaire de confiance pour les services d'immigration et d'intégration au Canada. Nous nous spécialisons dans l'orientation et la facilitation des processus de migration, en offrant une assistance exceptionnelle à chaque étape du chemin. Nos services complets sont proposés à un tarif global de 6000 DA. Nous vous invitons également à visiter notre page Facebook pour en savoir plus sur nos services et rester informés des dernières nouvelles.
        </p>
      );
      break;
    case 'ar':
      content = (
        <p>
          مرحبًا بكم في Elakhiar للهجرة والاندماج، شريككم الموثوق به لخدمات الهجرة والاندماج في كندا. نحن متخصصون في توجيه وتسهيل عمليات الهجرة، مقدمين المساعدة الاستثنائية في كل خطوة. رسوم خدماتنا الكلية هي 6000 دينار جزائري. ندعوكم أيضًا لزيارة صفحتنا على فيسبوك لمعرفة المزيد عن خدماتنا والبقاء على اطلاع بآخر الأخبار.
        </p>
      );
      break;
    default: // 'en' or any other fallback
      content = (
        <p>
          Welcome to Elakhiar Immigration and Integration, your trusted partner for immigration and integration services in Canada. We specialize in guiding and facilitating migration processes, providing exceptional assistance every step of the way. Our comprehensive services are offered at a total fee of 6000 DA. We also invite you to visit our Facebook page to learn more about our services and stay updated with the latest news.
        </p>
      );
      break;
  }

  return (
    <main dir={`${local === 'ar' ? 'rtl' : 'ltr' }`} className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl p-4 my-12 mx-3 ">
        <div className="block">
          <h1 className="text-2xl font-bold text-muted-foreground">{t('about')}</h1>
        </div>

        <div className="block mt-5 text-md font-medium">
          {content}
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
