import { useState } from 'react';
import { Navbar, type ActiveTab } from './components/Navbar';
import { HomeLoanCalculator } from './components/HomeLoanCalculator';
import { StampDutyCalculator } from './components/StampDutyCalculator';
import { BorrowingPowerCalculator } from './components/BorrowingPowerCalculator';
import { RefinanceCalculator } from './components/RefinanceCalculator';
import { RentVsBuyCalculator } from './components/RentVsBuyCalculator';
import { RateComparisonTable } from './components/RateComparisonTable';
import { BrokerMatcher } from './components/BrokerMatcher';
import { LeadModal } from './components/LeadModal';
import { EmbedWidgetModal } from './components/EmbedWidgetModal';
import { Footer } from './components/Footer';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home-loan');
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadModalData, setLeadModalData] = useState<any>(null);
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);

  const handleOpenLeadModal = (details?: any) => {
    setLeadModalData(details || null);
    setLeadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLeadModal={() => handleOpenLeadModal()}
        onOpenWidgetModal={() => setWidgetModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 flex-1 w-full">
        {/* Active Calculator View */}
        {activeTab === 'home-loan' && (
          <HomeLoanCalculator onOpenLeadModal={handleOpenLeadModal} />
        )}

        {activeTab === 'stamp-duty' && (
          <StampDutyCalculator onOpenLeadModal={handleOpenLeadModal} />
        )}

        {activeTab === 'borrowing-power' && (
          <BorrowingPowerCalculator onOpenLeadModal={handleOpenLeadModal} />
        )}

        {activeTab === 'refinance' && (
          <RefinanceCalculator onOpenLeadModal={handleOpenLeadModal} />
        )}

        {activeTab === 'rent-vs-buy' && (
          <RentVsBuyCalculator onOpenLeadModal={handleOpenLeadModal} />
        )}

        {activeTab === 'compare-rates' && (
          <RateComparisonTable onOpenLeadModal={handleOpenLeadModal} />
        )}

        {/* Global Embedded Rate Comparison Strip (when on home loan) */}
        {activeTab === 'home-loan' && (
          <section className="pt-4 border-t border-slate-200/80">
            <RateComparisonTable onOpenLeadModal={handleOpenLeadModal} />
          </section>
        )}

        {/* Dynamic Australian Broker Matcher (Global Section) */}
        <section className="pt-4">
          <BrokerMatcher onOpenLeadModal={(broker) => handleOpenLeadModal({ broker })} />
        </section>
      </main>

      {/* Modals */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        initialData={leadModalData}
      />

      <EmbedWidgetModal
        isOpen={widgetModalOpen}
        onClose={() => setWidgetModalOpen(false)}
      />

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenWidgetModal={() => setWidgetModalOpen(true)}
        onOpenLeadModal={() => handleOpenLeadModal()}
      />
    </div>
  );
}

export default App;
