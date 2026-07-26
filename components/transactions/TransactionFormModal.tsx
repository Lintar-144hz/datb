'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useFinanceStore } from '@/store/useFinanceStore';
import { TransactionType } from '@/types/transaction';
import { ArrowDownLeft, ArrowUpRight, Plus, Calendar, Tag, DollarSign, FileText } from 'lucide-react';

const schema = z.object({
  amount: z.number().min(1, 'Jumlah harus lebih dari 0'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Pilih kategori'),
  note: z.string().optional(),
  created_at: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function TransactionFormModal() {
  const { isAddTransactionOpen, activeEditTransactionId, closeAddTransactionModal } =
    useFinanceStore();
  const { transactions, addTransaction, updateTransaction, isAdding, isUpdating } =
    useTransactions();
  const { categories } = useCategories();

  const editTx = activeEditTransactionId
    ? transactions.find((t) => t.id === activeEditTransactionId)
    : null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      type: 'expense',
      category: '',
      note: '',
      created_at: new Date().toISOString().split('T')[0],
    },
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (editTx) {
      setValue('amount', editTx.amount);
      setValue('type', editTx.type);
      setValue('category', editTx.category);
      setValue('note', editTx.note || '');
      setValue('created_at', editTx.created_at.split('T')[0]);
    } else {
      reset({
        amount: 0,
        type: 'expense',
        category: '',
        note: '',
        created_at: new Date().toISOString().split('T')[0],
      });
    }
  }, [editTx, setValue, reset, isAddTransactionOpen]);

  const availableCategories = categories.filter((c) => c.type === selectedType);

  // Auto-select first available category if empty
  useEffect(() => {
    if (availableCategories.length > 0 && !watch('category')) {
      setValue('category', availableCategories[0].name);
    }
  }, [selectedType, availableCategories, setValue, watch]);

  const onSubmit = async (data: FormData) => {
    try {
      if (editTx) {
        await updateTransaction({
          id: editTx.id,
          data: {
            amount: data.amount,
            type: data.type,
            category: data.category,
            note: data.note,
            created_at: data.created_at ? new Date(data.created_at).toISOString() : undefined,
          },
        });
      } else {
        await addTransaction({
          amount: data.amount,
          type: data.type,
          category: data.category,
          note: data.note,
          created_at: data.created_at ? new Date(data.created_at).toISOString() : undefined,
        });
      }
      closeAddTransactionModal();
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isAddTransactionOpen}
      onClose={closeAddTransactionModal}
      title={editTx ? 'Edit Transaksi' : 'Catat Transaksi Baru'}
      description="Kelola pencatatan keuangan secara rapi & akurat"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
        {/* Type Segmented Switch */}
        <div className="grid grid-cols-2 gap-2 bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setValue('type', 'expense');
              setValue('category', '');
            }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedType === 'expense'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <ArrowUpRight className="h-4 w-4" />
            <span>Pengeluaran</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setValue('type', 'income');
              setValue('category', '');
            }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedType === 'income'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <ArrowDownLeft className="h-4 w-4" />
            <span>Pemasukan</span>
          </button>
        </div>

        {/* Amount */}
        <GlassInput
          label="Jumlah (Rp)"
          type="number"
          placeholder="0"
          icon={<DollarSign className="h-4 w-4" />}
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
        />

        {/* Category Select */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Kategori
          </label>
          <div className="relative flex items-center">
            <Tag className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none appearance-none"
              {...register('category')}
            >
              <option value="" disabled className="dark:bg-slate-900">
                Pilih Kategori
              </option>
              {availableCategories.map((c) => (
                <option key={c.id} value={c.name} className="dark:bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="text-xs text-rose-500 font-medium">{errors.category.message}</p>
          )}
        </div>

        {/* Note */}
        <GlassInput
          label="Catatan (Opsional)"
          placeholder="Contoh: Belanja bahan makanan mingguan"
          icon={<FileText className="h-4 w-4" />}
          {...register('note')}
        />

        {/* Date */}
        <GlassInput
          label="Tanggal Transaksi"
          type="date"
          icon={<Calendar className="h-4 w-4" />}
          {...register('created_at')}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800">
          <GlassButton
            type="button"
            variant="ghost"
            onClick={closeAddTransactionModal}
          >
            Batal
          </GlassButton>
          <GlassButton
            type="submit"
            variant="primary"
            isLoading={isAdding || isUpdating}
          >
            {editTx ? 'Simpan Perubahan' : 'Simpan Transaksi'}
          </GlassButton>
        </div>
      </form>
    </Modal>
  );
}
