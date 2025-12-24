import { Input } from "@/components/ui/input";

export function FixedDepositFeature() {
    return (
        <div id="fixedDepositsSection">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Fixed Desposits</h1>
                <Input
                    type="search"
                    placeholder="Search fixed deposists by name..."
                    className="search-bar"
                    onChange={e => setFixedDepositSearchText(e.target.value)}
                />
                <AddFixedDepositForm
                    form={form}
                    onSubmit={onSubmit}
                    fixedDepositDialogOpen={fixedDepositDialogOpen}
                    setProfileDialogOpen={setFixedDepositDialogOpen}
                    setIsUpdate={setIsUpdate}
                />
            </div>
            <div className="normal-grid">
                {filteredFixedDepositData
                    ? (
                        filteredFixedDepositData.map(fixedDeposit => (
                            <FixedDepositSection
                                fixedDeposit={fixedDeposit}
                                key={fixedDeposit.fixedDepositId}
                                form={form}
                                setIsUpdate={setIsUpdate}
                                setFixedDepositDialogOpen={setFixedDepositDialogOpen}
                                handleDeleteFixedDeposit={handleDeleteFixedDeposit}
                            />
                        ))
                    )
                    : (
                        <p className="text-muted-foreground text-sm">
                            Create a new fixed deposit here
                        </p>
                    )}
            </div>
            <AlertDialogComponent
                isDialogOpen={deleteFixedDepositDialogOpen}
                alertType="DELETE_FIXED_DEPOSIT"
                onSecondaryButtonClick={cancelDeleteFixedDeposit}
                onPrimaryButtonClick={deleteCurrentFixedDeposit}
            />
        </div>
    )
}